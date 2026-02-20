
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

async function main() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log(`Checking Google Key ending in: ${key ? key.slice(-4) : "NONE"}`);

    if (!key) {
        console.error("ERROR: No GOOGLE_GENERATIVE_AI_API_KEY found in .env.local");
        process.exit(1);
    }

    try {
        console.log("Sending request to Google (gemini-1.5-flash)...");
        const { text } = await generateText({
            model: google("gemini-1.5-flash"),
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
