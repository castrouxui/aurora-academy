
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

async function main() {
    const key = process.env.OPENAI_API_KEY;
    console.log(`Checking Query with Key ending in: ${key ? key.slice(-4) : "NONE"}`);

    if (!key) {
        console.error("ERROR: No OPENAI_API_KEY found in .env.local");
        process.exit(1);
    }

    try {
        console.log("Sending request to OpenAI (gpt-4o-mini)...");
        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: "Are you working?",
        });
        console.log("SUCCESS! API responded:", text);
    } catch (error: any) {
        console.error("FAILURE! API Error:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", await error.response.text());
        } else {
            console.error(error.message || error);
        }
        process.exit(1);
    }
}

main();
