import OpenAI from "openai";

// OpenAI client singleton
let openaiClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// Define response input type
type ResponseInput = {
    role: "user" | "assistant" | "system";
    content: string;
}[];

// Chat with streaming using Responses API - returns a ReadableStream
export async function chatStream(
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    systemInstruction: string,
    vectorStoreId?: string,
    model: string = "gpt-4.1-mini"
): Promise<ReadableStream<Uint8Array>> {
    const openai = getOpenAI();

    // Build input array for Responses API
    const input: ResponseInput = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));

    // Build tools array
    const tools: Array<{
        type: "file_search";
        vector_store_ids: string[];
        max_num_results?: number;
    }> = [];

    if (vectorStoreId) {
        tools.push({
            type: "file_search",
            vector_store_ids: [vectorStoreId],
            max_num_results: 20,
        });
    }

    // Create request params
    const requestParams: Parameters<typeof openai.responses.create>[0] = {
        model,
        instructions: systemInstruction,
        input: input as any,
        stream: true,
    };

    if (tools.length > 0) {
        requestParams.tools = tools as any;
    }

    const response = await openai.responses.create(requestParams);

    // Create a ReadableStream from the async iterator
    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            try {
                for await (const event of response) {
                    const eventData = event as any;
                    if (eventData.type === "response.output_text.delta" && eventData.delta) {
                        controller.enqueue(encoder.encode(eventData.delta));
                    } else if (eventData.type === "content_block_delta" && eventData.delta?.text) {
                        controller.enqueue(encoder.encode(eventData.delta.text));
                    }
                }
                controller.close();
            } catch (error) {
                controller.error(error);
            }
        },
    });
}

// Chat without streaming (for simple cases)
export async function chat(
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    systemInstruction: string,
    vectorStoreId?: string,
    model: string = "gpt-4.1-mini"
): Promise<string> {
    const openai = getOpenAI();

    const input: ResponseInput = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));

    const tools: Array<{
        type: "file_search";
        vector_store_ids: string[];
        max_num_results?: number;
    }> = [];

    if (vectorStoreId) {
        tools.push({
            type: "file_search",
            vector_store_ids: [vectorStoreId],
            max_num_results: 20,
        });
    }

    const requestParams: Parameters<typeof openai.responses.create>[0] = {
        model,
        instructions: systemInstruction,
        input: input as any,
    };

    if (tools.length > 0) {
        requestParams.tools = tools as any;
    }

    const response = await openai.responses.create(requestParams);

    // Extract text from response
    let text = "";
    const responseData = response as any;

    if (responseData.output) {
        for (const output of responseData.output) {
            if (output.type === "message" && output.content) {
                for (const content of output.content) {
                    if (content.type === "output_text") {
                        text += content.text;
                    }
                }
            }
        }
    }

    // Fallback for different response structures
    if (!text && responseData.output_text) {
        text = responseData.output_text;
    }

    return text;
}

// Create a new vector store
export async function createVectorStore(name: string) {
    const openai = getOpenAI();
    const vectorStore = await openai.vectorStores.create({ name });
    return vectorStore;
}

// Upload file to vector store
export async function uploadFileToVectorStore(
    vectorStoreId: string,
    file: File
) {
    const openai = getOpenAI();

    // First upload the file
    const uploadedFile = await openai.files.create({
        file,
        purpose: "assistants",
    });

    // Add file to vector store
    const vectorStoreFile = await openai.vectorStores.files.create(vectorStoreId, {
        file_id: uploadedFile.id,
    });

    return { file: uploadedFile, vectorStoreFile };
}

// Get vector store files
export async function getVectorStoreFiles(vectorStoreId: string) {
    const openai = getOpenAI();

    try {
        const files = await openai.vectorStores.files.list(vectorStoreId);
        return files.data;
    } catch {
        return [];
    }
}

// Delete file from vector store
export async function deleteVectorStoreFile(
    vectorStoreId: string,
    fileId: string
) {
    const openai = getOpenAI();

    await openai.vectorStores.files.del(vectorStoreId, fileId);
    await openai.files.del(fileId);
}

// Get vector store info
export async function getVectorStore(vectorStoreId: string) {
    const openai = getOpenAI();

    try {
        return await openai.vectorStores.retrieve(vectorStoreId);
    } catch {
        return null;
    }
}
