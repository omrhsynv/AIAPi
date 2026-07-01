/**
 * Admin kullanıcı oluşturma/silme scripti
 * 
 * Kullanım:
 *   npx tsx scripts/create-admin.ts <email>     - Role'ü admin yap
 *   npx tsx scripts/create-admin.ts reset       - Eski admin'i sil
 */

async function main() {
    const arg = process.argv[2];

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
        if (arg === "reset") {
            // Reset admin
            const email = "admin@example.com";
            console.log("🗑️  Removing old admin:", email);

            await prisma.session.deleteMany({ where: { user: { email } } });
            await prisma.account.deleteMany({ where: { user: { email } } });
            await prisma.user.deleteMany({ where: { email } });

            console.log("✅ Old admin deleted");
            console.log("\n📋 Şimdi /register'dan yeni hesap oluşturup bu scripti email ile çalıştırın");

        } else if (arg && arg.includes("@")) {
            // Set admin role
            const email = arg;
            console.log("👤 Setting admin role for:", email);

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                console.log("\n❌ Kullanıcı bulunamadı!");
                console.log("💡 Önce /register sayfasından kayıt olun");
                return;
            }

            await prisma.user.update({
                where: { email },
                data: { role: "admin" },
            });

            console.log("\n✅ Admin role atandı!");
            console.log("📧 Email:", email);
            console.log("👤 Name:", user.name);
            console.log("\n🔗 Giriş yapın: /login");

        } else {
            console.log("📖 Kullanım:");
            console.log("   npx tsx scripts/create-admin.ts <email>  - Admin yap");
            console.log("   npx tsx scripts/create-admin.ts reset    - Eski admin'i sil");
        }
    } catch (error) {
        console.error("❌ Hata:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
