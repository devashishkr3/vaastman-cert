import { prisma } from "../lib/db";
import { Role } from "../lib/generated/prisma/client";

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.error("Usage: bun run scripts/add-allowed-email.ts <email> [role]");
    console.error("Available roles:", Object.values(Role).join(", "));
    process.exit(1);
  }

  const role = (args[1] || "STAFF").toUpperCase() as Role;

  if (!Object.values(Role).includes(role)) {
    console.error(`Invalid role: ${role}`);
    console.error("Available roles:", Object.values(Role).join(", "));
    process.exit(1);
  }

  try {
    const record = await prisma.allowedEmail.create({
      data: {
        email,
        role,
      },
    });
    console.log("Successfully added allowed email:", record);
  } catch (error: any) {
    if (error?.code === "P2002") {
      console.error(`Error: Email '${email}' is already in the allowed list.`);
    } else {
      console.error("Error adding email:", error);
    }
  } finally {
    process.exit(0);
  }
}

main();
