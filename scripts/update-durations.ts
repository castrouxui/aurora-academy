
import { PrismaClient } from '@prisma/client';

// Simple ISO 8601 duration parser for YouTube (e.g., PT1H2M10S)
function parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = (parseInt(match[1] || '0') || 0);
    const minutes = (parseInt(match[2] || '0') || 0);
    const seconds = (parseInt(match[3] || '0') || 0);

    return (hours * 3600) + (minutes * 60) + seconds;
}

function getYouTubeId(url: string | null): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const prisma = new PrismaClient();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function main() {
    if (!YOUTUBE_API_KEY) {
        console.error("❌ Error: YOUTUBE_API_KEY environment variable is missing.");
        console.error("Please run with: YOUTUBE_API_KEY=your_key npx tsx scripts/update-durations.ts");
        process.exit(1);
    }

    console.log("🔍 Fetching lessons with YouTube URLs...");

    // Fetch all lessons that have a videoUrl
    const lessons = await prisma.lesson.findMany({
        where: {
            videoUrl: {
                contains: 'youtu', // Simple filter
            }
        },
        select: {
            id: true,
            title: true,
            videoUrl: true,
            duration: true
        }
    });

    console.log(`Found ${lessons.length} lessons with potential YouTube URLs.`);

    // Extract Video IDs
    const updates: { id: string, duration: number }[] = [];
    const chunks = [];
    let currentChunk: string[] = [];
    const lessonMap = new Map<string, typeof lessons[0]>();

    for (const lesson of lessons) {
        const videoId = getYouTubeId(lesson.videoUrl);
        if (videoId) {
            currentChunk.push(videoId);
            lessonMap.set(videoId, lesson);
            if (currentChunk.length === 50) {
                chunks.push(currentChunk);
                currentChunk = [];
            }
        }
    }
    if (currentChunk.length > 0) chunks.push(currentChunk);

    console.log(`Processing ${chunks.length} batches of videos...`);

    // Process Batches
    for (const chunk of chunks) {
        const ids = chunk.join(',');
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=contentDetails&key=${YOUTUBE_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error.message);
                continue;
            }

            if (data.items) {
                for (const item of data.items) {
                    const durationSec = parseDuration(item.contentDetails.duration);
                    // Find corresponding lesson(s) - naive since multiple lessons might share video, but map logic above overwrites. 
                    // Better: Reverse lookup from lesson list using ID.

                    // Actually, let's look up which lesson had this video ID.
                    // Doing a simplified pass:
                    const relatedLessons = lessons.filter(l => getYouTubeId(l.videoUrl) === item.id);

                    for (const l of relatedLessons) {
                        if (l.duration !== durationSec && durationSec > 0) {
                            updates.push({ id: l.id, duration: durationSec });
                            console.log(`✅ [${l.title}] ${l.duration}s -> ${durationSec}s`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    console.log(`\nReady to update ${updates.length} lessons.`);

    // Execute Updates
    for (const update of updates) {
        await prisma.lesson.update({
            where: { id: update.id },
            data: { duration: update.duration }
        });
    }

    console.log("🎉 Done!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
