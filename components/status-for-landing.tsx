"use client";

import {
  IconBrandGoogle,
  IconBriefcase,
  IconShieldCheck,
  IconStarFilled,
} from "@tabler/icons-react";
import { motion, useInView, type Variants } from "motion/react";
import { useMemo, useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* ─── Chart data ──────────────────────────────────────────────────────── */

const SATISFACTION_SCORE = 95;

const satisfactionConfig = {
  score: {
    label: "Satisfied",
    color: "var(--chart-1)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

const metricsTarget = [
  { metric: "Projects", value: 50, fill: "var(--color-projects)" },
  { metric: "Clients", value: 20, fill: "var(--color-clients)" },
  { metric: "Retention", value: 95, fill: "var(--color-retention)" },
  { metric: "Uptime", value: 99, fill: "var(--color-uptime)" },
];

const metricsConfig = {
  value: { label: "Value" },
  projects: { label: "Projects Shipped", color: "var(--chart-1)" },
  clients: { label: "Happy Clients", color: "var(--chart-2)" },
  retention: { label: "Client Retention %", color: "var(--chart-3)" },
  uptime: { label: "Uptime %", color: "var(--chart-4)" },
} satisfies ChartConfig;

/* ─── Review platform data ────────────────────────────────────────────── */

const reviews = [
  {
    icon: IconBriefcase,
    iconColor: "#2563EB",
    platform: "Clutch",
    sublabel: "B2B Rating",
    metric: "4.9",
    metricSuffix: "/5",
    subtext: "Verified B2B Rating",
    description:
      "Recognized as a leading software engineering partner based on verified client testimonials.",
    starColor: "text-blue-500",
    ratingCount: 5,
    accentHsl: "217 91% 53%",
  },
  {
    icon: IconBrandGoogle,
    iconColor: "#EA4335",
    platform: "Google",
    sublabel: "Client Trust",
    metric: "5.0",
    metricSuffix: "/5",
    subtext: "Exceptional Service",
    description:
      "Highly rated for transparent communication, development agility, and ongoing support.",
    starColor: "text-red-500",
    ratingCount: 5,
    accentHsl: "4 90% 58%",
  },
  {
    icon: IconShieldCheck,
    iconColor: "#059669",
    platform: "NPS",
    sublabel: "Net Promoter",
    metric: "98",
    metricSuffix: "%",
    subtext: "Net Promoter Score",
    description:
      "Outstanding satisfaction index highlighting our commitment to long-term solutions.",
    starColor: "text-emerald-500",
    ratingCount: 5,
    accentHsl: "160 96% 30%",
  },
];

/* ─── Animation variants ──────────────────────────────────────────────── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
} satisfies Variants;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} satisfies Variants;

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} satisfies Variants;

/* ─── Component ───────────────────────────────────────────────────────── */

export default function StatsForLanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  /* Swap between zero and real data based on viewport visibility.
	   Recharts will animate from old data → new data via its built-in
	   `isAnimationActive` + `animationDuration` props. */
  const satisfactionData = useMemo(
    () =>
      inView
        ? [
            {
              name: "score",
              value: SATISFACTION_SCORE,
              fill: "var(--color-score)",
            },
            {
              name: "remaining",
              value: 100 - SATISFACTION_SCORE,
              fill: "var(--muted)",
            },
          ]
        : [
            { name: "score", value: 0, fill: "var(--color-score)" },
            { name: "remaining", value: 100, fill: "var(--muted)" },
          ],
    [inView],
  );

  const metricsData = useMemo(
    () =>
      inView ? metricsTarget : metricsTarget.map((m) => ({ ...m, value: 0 })),
    [inView],
  );

  return (
    <div
      ref={sectionRef}
      className="flex flex-col gap-10 border-t border-border/50 pt-16"
    >
      {/* ── Section header ─────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col gap-3"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headerFade}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Reviews & Ratings
        </span>
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Impact in Numbers
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Real metrics from real work — every figure here is backed by shipped
          products, satisfied clients, and verified platform reviews.
        </p>
      </motion.div>

      {/* ── Charts + Reviews grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Charts column */}
        <motion.div
          className="flex flex-col gap-4 lg:col-span-5"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {/* Donut gauge: Satisfaction */}
          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden rounded-2xl border-border/60 p-0">
              <CardContent className="flex items-center gap-6 p-5">
                <ChartContainer
                  config={satisfactionConfig}
                  className="mx-auto min-h-[120px] w-[120px]"
                >
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={38}
                      outerRadius={54}
                      strokeWidth={0}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={true}
                      animationDuration={1400}
                      animationBegin={200}
                    >
                      {satisfactionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-2xl font-bold"
                                >
                                  {inView ? `${SATISFACTION_SCORE}%` : "0%"}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    Client Satisfaction
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    Based on post-project reviews across 50+ delivered projects.
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horizontal bar chart: Key metrics */}
          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden rounded-2xl border-border/60 p-0">
              <CardContent className="p-5">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Key Metrics
                </span>
                <ChartContainer
                  config={metricsConfig}
                  className="min-h-[160px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={metricsData}
                    layout="vertical"
                    margin={{ left: -8, right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      hide
                    />
                    <YAxis
                      type="category"
                      dataKey="metric"
                      tickLine={false}
                      axisLine={false}
                      width={72}
                      tick={{
                        fontSize: 12,
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          nameKey="metric"
                          formatter={(value) =>
                            `${value}${Number(value) > 50 ? "%" : "+"}`
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 6, 6, 0]}
                      barSize={16}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationBegin={400}
                    >
                      {metricsData.map((entry) => (
                        <Cell key={entry.metric} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right: Review platform cards */}
        <motion.div
          className="flex flex-col gap-4 lg:col-span-7"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {reviews.map((r) => (
            <motion.div key={r.platform} variants={fadeUp}>
              <Card
                className="group relative overflow-hidden rounded-2xl border-border/60 p-0 transition-all duration-300 hover:border-primary/40"
                style={{
                  backgroundImage: `repeating-linear-gradient(
										135deg,
										hsl(${r.accentHsl} / 0.05) 0px,
										hsl(${r.accentHsl} / 0.05) 1px,
										transparent 1px,
										transparent 6px
									)`,
                }}
              >
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6">
                  {/* Platform badge + Score */}
                  <div className="flex items-center gap-4 sm:min-w-[180px]">
                    <div
                      className="inline-flex items-center gap-2.5 rounded-xl px-3 py-1.5"
                      style={{
                        backgroundColor: `hsl(${r.accentHsl} / 0.08)`,
                        border: `1px solid hsl(${r.accentHsl} / 0.2)`,
                      }}
                    >
                      <r.icon
                        className="size-5 shrink-0"
                        style={{ color: r.iconColor }}
                      />
                      <div className="flex flex-col items-start leading-none">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: r.iconColor }}
                        >
                          {r.platform}
                        </span>
                        <span className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
                          {r.sublabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-3xl font-bold tracking-tighter text-foreground">
                        {r.metric}
                      </span>
                      <span className="text-lg font-medium text-muted-foreground">
                        {r.metricSuffix}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {r.subtext}
                    </p>
                    <p className="text-xs leading-snug text-muted-foreground">
                      {r.description}
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex shrink-0 gap-0.5">
                    {Array.from({ length: r.ratingCount }).map((_, i) => (
                      <IconStarFilled
                        key={`${r.platform}-star-${i}`}
                        className={`size-4 ${r.starColor}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
