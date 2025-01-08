"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoInfo, JSONData } from "@/types/files";
import BackBtn from "@/components/BackBtn";
import ErrorMsg from "@/components/ErrorMsg";
import { VideoPlayer } from "@/components/videoPlayer/VideoPlayer";

export default function VideoPage() {
    const params = useParams();
    const { pairs } = useStore();
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [jsonData, setJsonData] = useState<JSONData | null>(null);

    useEffect(() => {
        const currentPair = pairs.find(
            pair => pair.video.videoPath === decodeURIComponent(params.id as string)
        );
        setCurrentVideo(currentPair?.video || null);
        setJsonData(currentPair?.json || null);
    }, [params.id, pairs]);

    if (!currentVideo) {
        return <ErrorMsg error="Video not found" />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            <BackBtn />
            <VideoPlayer 
                currentVideo={currentVideo} 
                jsonData={jsonData as JSONData}
            />
        </div>
    );
}
