
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Load .env.local (override) - Temporarily disabled to debug
// dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

// Debug Env
console.log("DEBUG: CWD:", process.cwd());
console.log("DEBUG: DATABASE_URL is", process.env.DATABASE_URL ? "SET" : "UNSET");
if (process.env.DATABASE_URL) console.log("DEBUG: URL starts with", process.env.DATABASE_URL.split(':')[0]);

import { prisma } from '../src/lib/prisma';

async function verifyContent() {
    try {
        console.log("Checking Courses...");
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        if (courses.length === 0) {
            console.log("❌ No courses found in database.");
            return;
        }

        courses.forEach(c => {
            console.log(`\n📌 Course: ${c.title} (ID: ${c.id})`);
            console.log(`   Published: ${c.published}`);
            console.log(`   Modules: ${c.modules.length}`);
            c.modules.forEach(m => {
                console.log(`     📂 Module: ${m.title}`);
                m.lessons.forEach(l => {
                    console.log(`       🎥 Lesson: ${l.title} | VideoURL: ${l.videoUrl ? '✅ ' + l.videoUrl : '❌ MISSING'} | Published: ${l.published}`);
                });
            });
        });

    } catch (e) {
        console.error("Error verifying content:", e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyContent();
