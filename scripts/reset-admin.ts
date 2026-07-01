/**
 * Admin kullanıcıyı sil ve temizle
 * npx tsx scripts/reset-admin.ts
 */

async function resetAdmin() {
    const email = "admin@example.com";

    console.log("🗑️ Removing admin user:", email);

    try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        // Delete related records first
        await prisma.account.deleteMany({ where: { user: { email } } });
        await prisma.session.deleteMany({ where: { user: { email } } });

        // Delete user
        const deleted = await prisma.user.deleteMany({ where: { email } });

        if (deleted.count > 0) {
            console.log("✅ Admin user deleted");
        } else {
            console.log("ℹ️ User not found");
        }

        await prisma.$disconnect();

        console.log("\n📋 Şimdi yapın:");
        console.log("1. /register sayfasından admin@example.com ile kayıt olun");
        console.log("2. npx tsx scripts/create-admin.ts admin@example.com");
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

resetAdmin();
