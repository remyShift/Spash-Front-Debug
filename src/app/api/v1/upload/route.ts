import { NextRequest, NextResponse } from "next/server";
import { mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const contentType = request.headers.get('content-type');
    const folderName = request.headers.get('x-folder-name');
    const fileName = request.headers.get('x-file-name');
    const chunkIndex = parseInt(request.headers.get('x-chunk-index') || '0');
    const totalChunks = parseInt(request.headers.get('x-total-chunks') || '1');

    if (!contentType?.includes('application/octet-stream')) {
        return NextResponse.json(
            { error: "The content type must be application/octet-stream" },
            { status: 400 }
        );
    }

    if (!folderName || !fileName) {
        return NextResponse.json(
            { error: "Missing information in headers" },
            { status: 400 }
        );
    }

    try {
        const uploadDir = path.join(process.cwd(), 'public', 'videos', folderName);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        const fileData = await request.blob();
        const buffer = Buffer.from(await fileData.arrayBuffer());
        
        const flags = chunkIndex === 0 ? 'w' : 'a';
        await fs.promises.writeFile(filePath, buffer, { flag: flags });

        return NextResponse.json({ 
            success: true,
            chunkIndex,
            isComplete: chunkIndex === totalChunks - 1
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json(
            { error: `Error during upload: ${error}` },
            { status: 500 }
        );
    }
} 