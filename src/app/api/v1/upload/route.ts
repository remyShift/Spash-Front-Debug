import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const mainVideo = formData.get('mainVideo') as File;
        const pipelineJson = formData.get('pipelineJson') as File;
        const statsJson = formData.get('statsJson') as File;
        const playerVideos = formData.getAll('playerVideos') as File[];

        if (!mainVideo || !pipelineJson || !statsJson) {
            return NextResponse.json(
                { error: "Missing required files" },
                { status: 400 }
            );
        }

        const folderName = formData.get('folderName') as string;
        const uploadDir = path.join(process.cwd(), 'public', 'videos', folderName);

        await mkdir(uploadDir, { recursive: true });

        await writeFile(
            path.join(uploadDir, mainVideo.name),
            Buffer.from(await mainVideo.arrayBuffer())
        );

        await writeFile(
            path.join(uploadDir, 'pipeline.json'),
            Buffer.from(await pipelineJson.arrayBuffer())
        );

        await writeFile(
            path.join(uploadDir, 'stats.json'),
            Buffer.from(await statsJson.arrayBuffer())
        );

        for (const video of playerVideos) {
            await writeFile(
                path.join(uploadDir, video.name),
                Buffer.from(await video.arrayBuffer())
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json(
            { error: "Error uploading files" },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}; 