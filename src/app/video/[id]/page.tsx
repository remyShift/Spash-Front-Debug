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

    useEffect(() => {
        if (videos.length === 0) {
            fetchFiles({ setLoading, setError, setVideos });
        }
    }, [setVideos, videos.length]);

    useEffect(() => {
        const video = videos.find(v => v.videoPath === decodeURIComponent(params.id as string));
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
    }, [params.id, videos]);

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
        <div className="flex flex-col h-full gap-4 p-4">
            <BackBtn />
            <VideoPlayer 
                currentVideo={currentVideo} 
                jsonData={jsonData as JSONData}
            />
        </div>
    );
}
