import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...\n");

    // ============================================
    // 1. Create Default Assistant
    // ============================================
    console.log("🤖 Creating default assistant...");

    const existingAssistant = await prisma.assistant.findFirst({
        where: { name: "Genel Asistan" },
    });

    if (!existingAssistant) {
        await prisma.assistant.create({
            data: {
                name: "Genel Asistan",
                description: "Genel amaçlı AI asistanı - her konuda yardımcı olur",
                systemInstruction: `Sen FriendlyAI'nin genel asistanısın. 
        
Görevlerin:
- Kullanıcıların sorularını yanıtlamak
- Yardımcı ve bilgilendirici olmak
- Türkçe konuşmak
- Profesyonel ama samimi bir üslup kullanmak

Önemli:
- Her zaman doğru bilgi vermeye çalış
- Emin olmadığın konularda bunu belirt
- Kullanıcıya saygılı ol`,
                model: "gpt-4.1-mini",
                color: "#3B82F6",
                icon: "bot",
                isPublic: true,
                isActive: true,
            },
        });
        console.log("   ✅ Default assistant created");
    } else {
        console.log("   ℹ️  Default assistant exists");
    }

    // ============================================
    // 2. Create App Settings
    // ============================================
    console.log("\n⚙️  Creating app settings...");

    const existingSettings = await prisma.appSettings.findFirst({
        where: { id: "default" },
    });

    if (!existingSettings) {
        await prisma.appSettings.create({
            data: {
                id: "default",
                appName: "FriendlyAI",
                theme: "blue",
            },
        });
        console.log("   ✅ App settings created");
    } else {
        console.log("   ℹ️  App settings exist");
    }

    // ============================================
    // Summary
    // ============================================
    console.log("\n" + "=".repeat(50));
    console.log("🎉 Seeding complete!\n");
    console.log("📋 Admin Oluşturmak İçin:");
    console.log("   1. /register sayfasından kayıt olun");
    console.log("   2. npx tsx scripts/create-admin.ts <email>");
    console.log("=".repeat(50));
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
