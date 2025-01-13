"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoInfo, JSONData } from "@/types/files";
import { fetchVideoData } from "@/utils/fetchVideoData";
import BackBtn from "@/components/ui/BackBtn";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { VideoPlayer } from "@/components/videoPlayer/VideoPlayer";
import Loader from "@/components/ui/Loader";
import { fetchFiles } from "@/utils/fetchFiles";
import Layers from "@/components/videoPlayer/layers/Layers";
import { useActiveLayers } from "@/context/layers";
import ToolBox from "@/components/toolBox/ToolBox";
import AllTimelines from "@/components/timelines/AllTimelines";

export default function VideoPage() {
    const params = useParams();
    const { activeLayers } = useActiveLayers();
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
        return (
            <div className="py-24">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 justify-center items-center">
                <ErrorMsg error={error} />
            </div>
        );
    }

    if (!currentVideo) {
        return (
            <div className="flex-1 justify-center items-center">
                <ErrorMsg error="Vidéo non trouvée" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 h-screen">
            <div className="flex gap-6 h-full">
                <BackBtn />
                <div className="flex justify-center gap-24 mt-2 h-full w-full">
                    <div className="flex flex-col gap-0 w-fit">
                        <Layers />
                        <div className="flex flex-col gap-2 w-full h-full">
                            <VideoPlayer
                                currentVideo={currentVideo} 
                                jsonData={jsonData as JSONData}
                                activeLayers={activeLayers}
                            />
                            {jsonData?.timeline && <AllTimelines events={jsonData.timeline} />}
                        </div>
                    </div>
                    <ToolBox videoData={jsonData as JSONData}/>
                </div>
            </div>
        </div>
    );
}   
