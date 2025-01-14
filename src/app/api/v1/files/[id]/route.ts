import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const videoPath = decodeURIComponent(id);
    const directoryPath = path.join(process.cwd(), "public", path.dirname(videoPath));

    return fs.promises.readdir(directoryPath)
        .then(files => {
            const jsonFile = files.find(file => path.extname(file).toLowerCase() === '.json');
            const statsFile = files.find(file => file.toLowerCase() === 'stats.json');
            if (!jsonFile || !statsFile) {
                return NextResponse.json({ jsonData: null, statsData: null }, { status: 404 });
            }

            const jsonPath = path.join(directoryPath, jsonFile);
            const statsPath = path.join(directoryPath, statsFile);

            return fs.promises.readFile(jsonPath, 'utf8')
                .then(jsonData => {
                    const parsedJsonData = JSON.parse(jsonData);

                    return fs.promises.readFile(statsPath, 'utf8')
                        .then(statsData => {
                            const parsedStatsData = JSON.parse(statsData);
                            return NextResponse.json({ jsonData: parsedJsonData, statsData: parsedStatsData }, { status: 200 });
                        });
                });
        })
        .catch(error => {
            console.error("Error reading directory or files:", error);
            return NextResponse.json(
                { error: "Error reading directory or files" },
                { status: 500 }
            );
        });
}
