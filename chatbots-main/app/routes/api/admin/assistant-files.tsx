import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { uploadFileToVectorStore, deleteVectorStoreFile, getVectorStoreFiles, createVectorStore } from "~/lib/openai.server";

// Helper to check if user is admin
async function isAdmin(request: Request): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user?.id) return false;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { role: true },
    });

    return user?.role === "admin";
}

// GET - List files for assistant's vector store
export async function loader({ request, params }: { request: Request; params: { assistantId: string } }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assistant = await prisma.assistant.findUnique({
        where: { id: params.assistantId },
        select: { vectorStoreId: true },
    });

    if (!assistant?.vectorStoreId) {
        return Response.json([]);
    }

    const files = await getVectorStoreFiles(assistant.vectorStoreId);
    return Response.json(files);
}

// POST - Upload file to assistant's vector store
// DELETE - Delete file from vector store
export async function action({ request, params }: { request: Request; params: { assistantId: string } }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assistantId = params.assistantId;

    if (request.method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json({ error: "File required" }, { status: 400 });
        }

        // Get or create vector store for this assistant
        let assistant = await prisma.assistant.findUnique({
            where: { id: assistantId },
        });

        if (!assistant) {
            return Response.json({ error: "Assistant not found" }, { status: 404 });
        }

        let vectorStoreId = assistant.vectorStoreId;

        if (!vectorStoreId) {
            // Create new vector store
            const vectorStore = await createVectorStore(`Assistant-${assistant.name}`);
            vectorStoreId = vectorStore.id;

            await prisma.assistant.update({
                where: { id: assistantId },
                data: {
                    vectorStoreId: vectorStore.id,
                    vectorStoreName: vectorStore.name,
                },
            });
        }

        // Upload file
        const result = await uploadFileToVectorStore(vectorStoreId, file);

        // Track in database
        await prisma.vectorStoreFile.create({
            data: {
                assistantId,
                openaiFileId: result.file.id,
                fileName: file.name,
                fileSize: file.size,
                status: result.vectorStoreFile.status,
            },
        });

        return Response.json(result);
    }

    if (request.method === "DELETE") {
        const url = new URL(request.url);
        const fileId = url.searchParams.get("fileId");

        if (!fileId) {
            return Response.json({ error: "File ID required" }, { status: 400 });
        }

        const assistant = await prisma.assistant.findUnique({
            where: { id: assistantId },
            select: { vectorStoreId: true },
        });

        if (assistant?.vectorStoreId) {
            await deleteVectorStoreFile(assistant.vectorStoreId, fileId);
        }

        await prisma.vectorStoreFile.deleteMany({
            where: { openaiFileId: fileId },
        });

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
