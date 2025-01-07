"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FileInfo } from "@/types/files";
import ReactPlayer from 'react-player'
import { drawSquare, generateSquareParams } from "@/utils/b-boxPlayer";

export default function VideoPage() {
    const params = useParams();
    const [video, setVideo] = useState<FileInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchVideoDetails = () => {
            fetch(`/api/v1/files/${params.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setVideo(data.file);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error:", err);
                    setError("Impossible to load the video details.");
                    setLoading(false);
                });
        };

        fetchVideoDetails();
    }, [params.id]);

    useEffect(() => {
        if (isPlaying && video) {
            const initialParams = generateSquareParams();
            drawSquare(initialParams.x, initialParams.y, initialParams.width, initialParams.height, canvasRef);
            
            const interval = setInterval(() => {
                const params = generateSquareParams();
                drawSquare(params.x, params.y, params.width, params.height, canvasRef);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying, video]);

    if (loading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-white">Loading...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">{error}</p>
        </div>
        );
    }

    if (!video) {
        return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-white">Video not found</p>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <h1 className="text-4xl text-white font-gilroy font-italic font-semibold">
                {video.folderName || video.videoName}
            </h1>
            <div className="bg-white/10 p-8 rounded-lg w-full max-w-2xl">
                <div className="space-y-4">
                    <p className="text-white">
                        <span className="font-semibold">Folder name :</span> {video.folderName || "Aucun"}
                    </p>
                    <p className="text-white">
                        <span className="font-semibold">Video name :</span> {video.videoName}
                    </p>
                    <p className="text-white">
                        <span className="font-semibold">Size :</span> {Math.round(video.size / 1024)} KB
                    </p>
                </div>
            </div>

            <div className="relative">
                <ReactPlayer
                    url={video?.path}
                    controls
                    width="800px"
                    height="600px"
                    style={{
                        borderRadius: "10px",
                    }}
                    type="video/x-matroska"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                />
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{
                        zIndex: 1
                    }}
                />
            </div>
        </div>
    );
}
