"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoInfo, JSONData } from "@/types/files";
import { fetchVideoData } from "@/utils/fetchVideoData";
import BackBtn from "@/components/BackBtn";
import ErrorMsg from "@/components/ErrorMsg";
import { VideoPlayer } from "@/components/videoPlayer/VideoPlayer";
import Loader from "@/components/Loader";
import { fetchFiles } from "@/utils/fetchFiles";

export default function VideoPage() {
    const params = useParams();
    const { videos, setVideos } = useStore();
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [jsonData, setJsonData] = useState<JSONData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const paramsId = params.id;

    useEffect(() => {
        if (videos.length === 0) {
            fetchFiles({ setLoading, setError, setVideos });
        }
    }, [setVideos, videos.length]);

    useEffect(() => {
        const video = videos.find(v => v.videoPath === decodeURIComponent(paramsId as string));
        setCurrentVideo(video || null);

        if (video) {
            setLoading(true);
            fetchVideoData(video.videoPath)
                .then(data => {
                    setJsonData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(`Error loading JSON data: ${err}`);
                    setLoading(false);
                });
        }
    }, [paramsId, videos]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorMsg error={error} />;
    }

    if (!currentVideo) {
        return <ErrorMsg error="Vidéo non trouvée" />;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <BackBtn />
            <div className="flex flex-col gap-0">
                <div className="w-fit px-2 h-8 bg-primary rounded-t-md">
                    <p className="text-white text-center font-semibold text-base pt-1">Layer</p>
                </div>
                <VideoPlayer 
                    currentVideo={currentVideo} 
                    jsonData={jsonData as JSONData}
                />
            </div>
        </div>
    );
}
