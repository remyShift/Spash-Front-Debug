"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { VideoInfo } from "@/types/files";
import ReactPlayer from 'react-player'
import { drawSquare, generateSquareParams } from "@/utils/b-boxPlayer";
import BackBtn from "@/components/devtool/BackBtn";
import { useStoreVideo } from "@/context/store";
import ErrorMsg from "@/components/ErrorMsg";
import Loader from "@/components/Loader";

export default function VideoPage() {
    const params = useParams();
    const { videos } = useStoreVideo();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        setLoading(true);
        setCurrentVideo(videos.find(v => v.path === decodeURIComponent(params.id as string)) || null);
        setLoading(false);
    }, [videos, params.id]);

    useEffect(() => {
        if (isPlaying && currentVideo && playerContainerRef.current) {
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
    }, [isPlaying, currentVideo]);

    if (!currentVideo && !loading) {
        return (
            <ErrorMsg error="Video not found" />
        );
    }

    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <BackBtn />
            <div className="relative w-full h-full" ref={playerContainerRef}>
                <ReactPlayer
                    url={currentVideo?.path || ""}
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
