
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function main() {
    if (!API_KEY) {
        console.error("No API Key found");
        return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log(`Fetching models from ${url}...`);

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) {
            console.error("Error:", data.error);
        } else {
            console.log("Available Models:");
            data.models?.forEach((m: any) => console.log(`- ${m.name}`));
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
