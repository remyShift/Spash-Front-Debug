import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { VideoInfo } from "@/types/files";

export async function GET() {
    const directoryPath = path.join(process.cwd(), "public", "videos");

    return fs.promises.access(directoryPath)
        .then(() => fs.promises.readdir(directoryPath, { withFileTypes: true }))
        .then(async entries => {
            const allVideos: VideoInfo[] = [];
            const allJSON: object[] = [];

            for (const entry of entries) {
                const fullPath = path.join(directoryPath, entry.name);

                if (entry.isDirectory()) {
                    const files = await fs.promises.readdir(fullPath);
                    const videoFile = files.find(file => {
                        const ext = path.extname(file).toLowerCase();
                        return ['.mkv', '.mp4', '.avi', '.mov'].includes(ext);
                    });

                    const jsonFile = files.find(file => {
                        const ext = path.extname(file).toLowerCase();
                        return ['.json'].includes(ext);
                    });

                    if (videoFile) {
                        const videoPath = path.join(fullPath, videoFile);
                        const videoStats = await fs.promises.stat(videoPath);
                        let jsonContent: object | undefined;

                        if (jsonFile) {
                            const jsonPath = path.join(fullPath, jsonFile);
                            await fs.promises.readFile(jsonPath, 'utf8')
                                .then(jsonData => {
                                    jsonContent = JSON.parse(jsonData);
                                })
                                .catch(error => {
                                    console.error(`Error reading JSON ${jsonPath}:`, error);
                                });
                        }

                        allVideos.push({
                            folderName: entry.name,
                            videoName: videoFile,
                            path: `/videos/${entry.name}/${videoFile}`,
                            size: videoStats.size,
                            createdAt: videoStats.birthtime.toISOString(),
                        });

                        if (jsonContent) {
                            allJSON.push(jsonContent);
                        }
                    }
                }
            }

            return NextResponse.json({ allVideos, allJSON }, { status: 200 });
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