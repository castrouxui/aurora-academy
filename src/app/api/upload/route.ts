import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

// Whitelist of allowed MIME types
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({
                error: `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate file size
        if (buffer.length > MAX_FILE_SIZE) {
            return NextResponse.json({
                error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
            }, { status: 413 });
        }

        // Ensure upload dir exists
        const uploadDir = join(process.cwd(), "public/uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        // Generate random filename for security (not timestamp-based)
        const ext = file.name.split('.').pop() || 'bin';
        const filename = `${randomBytes(16).toString('hex')}.${ext}`;
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
