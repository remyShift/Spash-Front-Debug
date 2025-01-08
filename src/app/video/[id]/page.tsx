"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { JSONData } from "@/context/store";
import { useStore } from "@/context/store";
import BackBtn from "@/components/devtool/BackBtn";
import { VideoInfo } from "@/types/files";
import ErrorMsg from "@/components/ErrorMsg";

export default function VideoPage() {
    const params = useParams();
    const { pairs } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [jsonData, setJsonData] = useState<JSONData | null>(null);

    useEffect(() => {
        const currentPair = pairs.find(pair => pair.video.videoPath === decodeURIComponent(params.id as string));
        setCurrentVideo(currentPair?.video || null);
        setJsonData(currentPair?.json || null);
    }, [params.id, pairs]);

    const handleProgress = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        if (!isPlaying) return;

        const playedSeconds = event.currentTarget.currentTime;
        const fps = 25;
        const currentFrame = Math.floor(playedSeconds * fps);

        if (jsonData?.data && jsonData.data[currentFrame]) {
            console.log(jsonData.data[currentFrame]["persontracking"]);
        }
    }

    if (!currentVideo) {
        return <ErrorMsg error="Video not found" />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            <BackBtn />
            <div className="relative w-full h-full">
                <video
                    src={currentVideo.videoPath}
                    controls
                    width="65%"
                    height="100%"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onProgress={handleProgress}
                />
                <canvas
                    className="absolute top-0 left-0 pointer-events-none w-full h-full"
                />
            </div>
        </div>
    );
}
