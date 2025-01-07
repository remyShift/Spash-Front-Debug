import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { useStoreVideo, useStoreJSON } from "@/context/store";

interface VideoInfo {
    folderName: string;
    videoName: string;
    path: string;
    size: number;
    createdAt: Date;
}

export async function GET() {
    const directoryPath = path.join(process.cwd(), "public", "videos");

    return fs.promises.access(directoryPath)
        .then(() => fs.promises.readdir(directoryPath, { withFileTypes: true }))
        .then(async entries => {
            console.log("------------entries----------");
            console.log("entries", entries);
            const allVideos: VideoInfo[] = [];

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
                        allVideos.push({
                            folderName: entry.name,
                            videoName: videoFile,
                            path: `/videos/${entry.name}/${videoFile}`,
                            size: videoStats.size,
                            createdAt: videoStats.birthtime
                        });
                    }

                    if (jsonFile) {
                        useStoreJSON.setState({ json: jsonFile });
                    }

                }
            }

            useStoreVideo.setState({ video: allVideos });

            return NextResponse.json({ files: allVideos }, { status: 200 });
        })
        .catch(error => {
            console.error("Erreur lors de la lecture des fichiers :", error);
            if (error.code === 'ENOENT') {
                return NextResponse.json(
                    { error: "Le dossier videos n'existe pas" },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: "Erreur lors de la lecture des fichiers" },
                { status: 500 }
            );
        });
}