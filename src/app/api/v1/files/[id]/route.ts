import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const videoPath = decodeURIComponent(id);
    const directoryPath = path.join(process.cwd(), "public", path.dirname(videoPath));

    return fs.promises.readdir(directoryPath)
        .then(files => {
            const jsonFile = files.find(file => path.extname(file).toLowerCase() === '.json');
            
            if (!jsonFile) {
                return NextResponse.json({ jsonData: null }, { status: 404 });
            }

            const jsonPath = path.join(directoryPath, jsonFile);
            return fs.promises.readFile(jsonPath, 'utf8')
                .then(jsonData => {
                    return NextResponse.json({ jsonData: JSON.parse(jsonData) }, { status: 200 });
                })
                .catch(error => {
                    console.error("Error reading JSON file:", error);
                    return NextResponse.json(
                        { error: "Error reading JSON file" },
                        { status: 500 }
                    );
                });
        })
        .catch(error => {
            console.error("Error reading directory:", error);
            return NextResponse.json(
                { error: "Error reading directory" },
                { status: 500 }
            );
        });
}
