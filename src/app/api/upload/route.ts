import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload dir exists
        const uploadDir = join(process.cwd(), "public/uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        // Unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const path = join(uploadDir, filename);

        await writeFile(path, buffer);
        console.log(`Saved file to ${path}`);

        return NextResponse.json({
            url: `/uploads/${filename}`,
            name: file.name
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
