"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FileInfo } from "@/types/files";
import ReactPlayer from 'react-player'
import { drawSquare, generateSquareParams } from "@/utils/b-boxPlayer";
import BackBtn from "@/components/devtool/BackBtn";

export default function VideoPage() {
    const params = useParams();
    const [video, setVideo] = useState<FileInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);

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
        if (isPlaying && video && playerContainerRef.current) {
            const videoWidth = playerContainerRef.current.offsetWidth;
            const videoHeight = playerContainerRef.current.offsetHeight;

            if (canvasRef.current) {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
            }

            const initialParams = generateSquareParams(videoWidth, videoHeight);
            drawSquare(initialParams.x, initialParams.y, initialParams.width, initialParams.height, videoWidth, videoHeight, canvasRef);
            
            const interval = setInterval(() => {
                const params = generateSquareParams(videoWidth, videoHeight);
                drawSquare(params.x, params.y, params.width, params.height, videoWidth, videoHeight, canvasRef);
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
        <div className="flex flex-col gap-4 p-4">
            <BackBtn />
            <div className="relative w-full h-full" ref={playerContainerRef}>
                <ReactPlayer
                    url={video?.path}
                    controls
                    width="65%"
                    height="100%"
                    style={{
                            position: "relative",
                            zIndex: 1,
                            backgroundColor: "black"
                        }}
                        type="video/x-matroska"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                    />
                    <canvas
                        ref={canvasRef}
                        className={`absolute z-50 top-0 left-0 pointer-events-none w-[65%] h-full`}
                    />
            </div>
        </div>
    );
}
