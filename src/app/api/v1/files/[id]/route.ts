import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const videoPath = decodeURIComponent(params.id);
    const directoryPath = path.join(process.cwd(), "public", path.dirname(videoPath));

    try {
        const files = await fs.promises.readdir(directoryPath);
        const jsonFile = files.find(file => path.extname(file).toLowerCase() === '.json');

        if (jsonFile) {
            const jsonPath = path.join(directoryPath, jsonFile);
            const jsonData = await fs.promises.readFile(jsonPath, 'utf8');
            return NextResponse.json({ jsonData: JSON.parse(jsonData) }, { status: 200 });
        }

        return NextResponse.json({ jsonData: null }, { status: 404 });
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return NextResponse.json(
            { error: "Error reading JSON file" },
            { status: 500 }
        );
    }
}
