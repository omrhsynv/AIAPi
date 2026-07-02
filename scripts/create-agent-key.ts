/**
 * Mint an API key for the Agent API. A key may only invoke the assistants it
 * is linked to. The target is chosen per-request by id or slug.
 *
 *   npx tsx scripts/create-agent-key.ts [name] [assistantIdOrSlug...]
 *
 * With no assistant refs, the key is linked to ALL current assistants (dev
 * convenience). The raw key is printed ONCE — only its sha256 hash is stored.
 */
import { createHash, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashKey(rawKey: string): string {
    return createHash("sha256").update(rawKey).digest("hex");
}

async function main() {
    const name = process.argv[2] ?? null;
    const refs = process.argv.slice(3);

    // Resolve which assistants this key may invoke.
    const assistants = refs.length
        ? await prisma.assistant.findMany({
              where: { OR: refs.flatMap((r) => [{ id: r }, { slug: r }]) },
              select: { id: true, name: true },
          })
        : await prisma.assistant.findMany({ select: { id: true, name: true } });

    if (assistants.length === 0) {
        console.error("No matching assistants found — key would have no permissions. Aborting.");
        process.exitCode = 1;
        return;
    }

    const rawKey = `sk_agent_${randomBytes(20).toString("hex")}`;

    await prisma.apiKey.create({
        data: {
            name,
            keyHash: hashKey(rawKey),
            keyPrefix: rawKey.slice(0, 16),
            assistants: { connect: assistants.map((a) => ({ id: a.id })) },
        },
    });

    console.log(`✅ API key created${name ? ` ("${name}")` : ""}`);
    console.log(`   Permitted assistants: ${assistants.map((a) => a.name).join(", ")}`);
    console.log("\n   Save this key now — it will not be shown again:\n");
    console.log(`   ${rawKey}\n`);
    console.log("   Call an agent by id or slug:");
    console.log(
        `   curl -N http://localhost:5173/api/v1/agents/<agentIdOrSlug> \\\n` +
            `     -H "Authorization: Bearer ${rawKey}" \\\n` +
            `     -H "Content-Type: application/json" \\\n` +
            `     -d '{"message":"merhaba"}'`,
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
