import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
    const email = "admin@example.com";
    const password = "admin123";
    const name = "Admin";

    console.log("🔧 Creating admin user...");

    // Delete existing user if exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        await prisma.user.delete({ where: { email } });
        console.log("🗑️ Deleted existing admin user");
    }

    // Create admin user via BetterAuth API
    const APP_URL = process.env.APP_URL || "http://localhost:5173";

    try {
        // Sign up
        const signUpResponse = await fetch(`${APP_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        if (!signUpResponse.ok) {
            const error = await signUpResponse.text();
            throw new Error(`Sign up failed: ${error}`);
        }

        console.log("✅ Admin user created");

        // Update role to admin
        await prisma.user.update({
            where: { email },
            data: { role: "admin" },
        });

        console.log("✅ Admin role assigned");
        console.log("\n📧 Email: admin@example.com");
        console.log("🔑 Password: admin123");
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        console.log("\n⚠️ Make sure the app is running (npm run dev) before running this script.");
    }
}

createAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
