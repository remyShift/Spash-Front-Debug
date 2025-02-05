import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import zlib from "zlib";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const videoPath = decodeURIComponent(id);
    
    const normalizedPath = path.normalize(videoPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const directoryPath = path.join(process.cwd(), "public", path.dirname(normalizedPath));

    return fs.promises.readdir(directoryPath)
        .then(files => {
            const jsonFile = files.find(file => path.extname(file).toLowerCase() === '.json');
            const statsFile = files.find(file => file.toLowerCase() === 'stats.json');
            
            if (!jsonFile || !statsFile) {
                return NextResponse.json(
                    { error: "Json and stats files are required" },
                    { status: 404 }
                );
            }

            const jsonPath = path.join(directoryPath, jsonFile);
            const statsPath = path.join(directoryPath, statsFile);

            return Promise.all([
                fs.promises.readFile(jsonPath, 'utf8'),
                fs.promises.readFile(statsPath, 'utf8')
            ])
            .then(([jsonData, statsData]) => {
                const parsedJsonData = JSON.parse(jsonData);
                const parsedStatsData = JSON.parse(statsData);
                
                const combinedData = Buffer.from(
                    JSON.stringify({
                        jsonData: parsedJsonData,
                        statsData: parsedStatsData
                    })
                );
                
                const compressedData = zlib.gzipSync(combinedData, {
                    level: 9,
                    memLevel: 9
                });

                return new NextResponse(compressedData, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Encoding': 'gzip',
                        'Content-Length': compressedData.length.toString(),
                        'Cache-Control': 'public, max-age=3600'
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error reading files:", error);
            return NextResponse.json(
                { error: "Server error when reading files" },
                { status: 500 }
            );
        });
}
