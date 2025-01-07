import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const videoPath = decodeURIComponent(params.id);
    const directoryPath = path.join(process.cwd(), "public");
    const fullPath = path.join(directoryPath, videoPath);

    const stats = await fs.promises.stat(fullPath);
    if (!stats || stats instanceof NextResponse) {
        return NextResponse.json(
            { error: "File not found" },
            { status: 404 }
        );
    }

    const pathParts = videoPath.split('/');
    const videoName = pathParts[pathParts.length - 1];
    const folderName = pathParts[pathParts.length - 2] === 'videos' ? '' : pathParts[pathParts.length - 2];

    return NextResponse.json({
        file: {
            folderName,
            videoName,
            path: videoPath,
            size: stats.size,
        }
    }, { status: 200 });
}