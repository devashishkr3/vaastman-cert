"use client";

import {
  IconAlertTriangleFilled,
  IconCheck,
  IconFileCheck,
  IconFileTypeCsv,
  IconLoader2,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { parse } from "csv-parse/sync";
import { useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  computeGrade,
  computeIsPrintable,
  EXPECTED_HEADERS,
  generateAttendance,
  sanitizeHeader,
  sanitizeValue,
  validateHeaders,
} from "@/app/(dashboard)/lib/old-student/csv-helpers";
import { csvRowSchema } from "@/app/(dashboard)/lib/old-student/zod-type/csv-schema";
import { useUploadOldStudents } from "@/app/(dashboard)/lib/old-student/query/mut-upload-old-students";

type ParsedRow = Record<string, string>;

type ValidatedRow = {
  raw: ParsedRow;
  valid: boolean;
  errors: string[];
  // computed preview fields
  grade: string | null;
  isPrintable: boolean;
  attendance: number;
};

export default function OldStudentsUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ValidatedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadOldStudents();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.endsWith(".csv")) {
      setError("Only .csv files are supported.");
      return;
    }

    setFile(selected);
    setError(null);
    setParsedRows([]);
    setHeaders([]);
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setError(null);

    try {
      const text = await file.text();

      // Parse CSV using csv-parse (already in project deps)
      const records: string[][] = parse(text, {
        skip_empty_lines: true,
        relax_column_count: true,
      });

      if (records.length < 2) {
        setError("CSV must have a header row and at least one data row.");
        setParsing(false);
        return;
      }

      // Sanitize headers
      const rawHeaders = records[0];
      const sanitizedHeaders = rawHeaders.map(sanitizeHeader);

      // Validate headers match exactly
      const headerValidation = validateHeaders(sanitizedHeaders);
      if (!headerValidation.valid) {
        const parts: string[] = [];
        if (headerValidation.missing.length > 0) {
          parts.push(`Missing columns: ${headerValidation.missing.join(", ")}`);
        }
        if (headerValidation.unexpected.length > 0) {
          parts.push(
            `Unexpected columns: ${headerValidation.unexpected.join(", ")}`,
          );
        }
        setError(`CSV header mismatch. ${parts.join(". ")}`);
        setParsing(false);
        return;
      }

      setHeaders(sanitizedHeaders);

      // Parse data rows
      const dataRows = records.slice(1);
      const validated: ValidatedRow[] = dataRows.map((row) => {
        // Build record object from sanitized headers
        const record: ParsedRow = {};
        for (let i = 0; i < sanitizedHeaders.length; i++) {
          record[sanitizedHeaders[i]] = sanitizeValue(row[i] ?? "");
        }

        // Validate with Zod
        const result = csvRowSchema.safeParse(record);
        const errors: string[] = [];

        if (!result.success) {
          for (const err of result.error.issues) {
            errors.push(`${err.path.join(".")}: ${err.message}`);
          }
        }

        // Compute preview values
        const marksStr = record.marks ?? "";
        const marksNum =
          marksStr.trim() === "" || marksStr.trim() === "-"
            ? null
            : Number(marksStr);
        const effectiveMarks =
          marksNum !== null && !Number.isNaN(marksNum) ? marksNum : null;

        return {
          raw: record,
          valid: result.success,
          errors,
          grade: computeGrade(effectiveMarks),
          isPrintable: computeIsPrintable(effectiveMarks),
          attendance: generateAttendance(),
        };
      });

      setParsedRows(validated);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to parse CSV.";
      setError(message);
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = () => {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) return;

    // Re-parse through Zod to get properly typed objects
    const rows = validRows.map((r) => csvRowSchema.parse(r.raw));
    uploadMutation.mutate({ rows });
  };

  const handleClear = () => {
    setFile(null);
    setParsedRows([]);
    setHeaders([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const validCount = parsedRows.filter((r) => r.valid).length;
  const invalidCount = parsedRows.filter((r) => !r.valid).length;
  const allValid = parsedRows.length > 0 && invalidCount === 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUpload className="size-5" />
            Upload Old Student Records
          </CardTitle>
          <CardDescription>
            Upload a CSV file with old student data. Headers must match exactly:{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {EXPECTED_HEADERS.join(", ")}
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="old-student-csv">Select CSV file</Label>
            <Input
              id="old-student-csv"
              type="file"
              accept=".csv"
              ref={inputRef}
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          {/* Selected file badge */}
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md w-fit">
              <IconFileTypeCsv className="size-5" />
              <span>{file.name}</span>
              <span className="text-xs">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="ml-1 hover:text-destructive cursor-pointer"
              >
                <IconX className="size-4" />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <IconAlertTriangleFilled className="size-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!file || parsing}>
              {parsing ? (
                <>
                  <IconLoader2 className="size-5 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <IconFileCheck className="size-5 mr-2" />
                  Parse & Validate
                </>
              )}
            </Button>

            {allValid && parsedRows.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                variant="default"
              >
                {uploadMutation.isPending ? (
                  <>
                    <IconLoader2 className="size-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <IconUpload className="size-5 mr-2" />
                    Upload {validCount} Records
                  </>
                )}
              </Button>
            )}

            {(file || parsedRows.length > 0) && (
              <Button variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {parsedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Validation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Badge variant="outline" className="gap-1">
                Total: {parsedRows.length}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1 border-green-500 text-green-600"
              >
                <IconCheck className="size-4" />
                Valid: {validCount}
              </Badge>
              {invalidCount > 0 && (
                <Badge
                  variant="outline"
                  className="gap-1 border-red-500 text-red-600"
                >
                  <IconAlertTriangleFilled className="size-4" />
                  Invalid: {invalidCount}
                </Badge>
              )}
            </div>

            {invalidCount > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Fix the following rows before uploading:
                </p>
                {parsedRows
                  .map((row, i) => ({ row, index: i }))
                  .filter(({ row }) => !row.valid)
                  .slice(0, 10)
                  .map(({ row, index }) => (
                    <div
                      key={index}
                      className="text-sm bg-destructive/10 p-2 rounded"
                    >
                      <span className="font-medium">Row {index + 1}:</span>{" "}
                      {row.errors.join("; ")}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Preview — {parsedRows.length} rows
            </CardTitle>
            <CardDescription>
              Showing CSV data with auto-generated fields (grade, attendance,
              printable status). First 50 rows displayed.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Status</TableHead>
                  {headers.map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                  <TableHead>grade</TableHead>
                  <TableHead>is_printable</TableHead>
                  <TableHead>attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.slice(0, 50).map((row, i) => (
                  <TableRow
                    key={row.raw.university_roll_no ?? `row-${i}`}
                    className={row.valid ? "" : "bg-destructive/5"}
                  >
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      {row.valid ? (
                        <IconCheck className="size-4 text-green-600" />
                      ) : (
                        <IconAlertTriangleFilled className="size-4 text-red-500" />
                      )}
                    </TableCell>
                    {headers.map((h) => (
                      <TableCell key={h} className="whitespace-nowrap">
                        {row.raw[h]}
                      </TableCell>
                    ))}
                    <TableCell>
                      {row.grade ? (
                        <Badge variant="outline">{row.grade}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.isPrintable ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-500 text-red-600"
                        >
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{row.attendance}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {parsedRows.length > 50 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing first 50 of {parsedRows.length} rows.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
