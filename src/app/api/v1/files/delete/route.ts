import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const folderName = searchParams.get('folder');

    if (!folderName) {
        return NextResponse.json(
            { error: "Folder name is required" },
            { status: 400 }
        );
    }

    const directoryPath = path.join(process.cwd(), "public", "videos", folderName);

    return fs.promises.rm(directoryPath, { recursive: true })
        .then(() => {
            return NextResponse.json({ success: true });
        })
        .catch((error) => {
            console.error("Error deleting folder:", error);
            return NextResponse.json(
                { error: "Error deleting folder" },
                { status: 500 }
            );
        });
}