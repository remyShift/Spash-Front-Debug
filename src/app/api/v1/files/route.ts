import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { VideoInfo } from "@/types/files";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const directoryPath = path.join(process.cwd(), "public", "videos");

    return fs.promises.access(directoryPath)
        .then(async () => {
            const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });
            const totalEntries = entries.length;
            const start = (page - 1) * limit;
            const paginatedEntries = entries.slice(start, start + limit);

            const allVideos: VideoInfo[] = [];

            for (const entry of paginatedEntries) {
                const fullPath = path.join(directoryPath, entry.name);

                if (entry.isDirectory()) {
                    const files = await fs.promises.readdir(fullPath);
                    const mainVideoFile = files.find(file => {
                        const ext = path.extname(file).toLowerCase();
                        const isVideo = ['.mkv', '.mp4', '.avi', '.mov'].includes(ext);
                        const isPlayerVideo = file.includes("body");
                        return isVideo && !isPlayerVideo;
                    });

                    if (mainVideoFile) {
                        const videoPath = path.join(fullPath, mainVideoFile);
                        const videoStats = await fs.promises.stat(videoPath);

                        allVideos.push({
                            folderName: entry.name,
                            videoName: mainVideoFile,
                            videoPath: `/videos/${entry.name}/${mainVideoFile}`,
                            path: `/videos/${entry.name}`,
                            size: videoStats.size,
                            createdAt: videoStats.birthtime.toISOString(),
                            playerVideoPath: { path: `/videos/${entry.name}/body.mp4` },
                        });
                    }
                }
            }

            return NextResponse.json({
                allVideos,
                pagination: {
                    total: totalEntries,
                    currentPage: page,
                    totalPages: Math.ceil(totalEntries / limit),
                    hasMore: (start + paginatedEntries.length) < totalEntries
                }
            }, { status: 200 });
        })
        .catch(error => {
            console.error("Error reading files:", error);
            if (error.code === 'ENOENT') {
                return NextResponse.json(
                    { error: "The videos folder does not exist" },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: "Error reading files" },
                { status: 500 }
            );
        });
}