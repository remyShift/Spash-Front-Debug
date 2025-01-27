"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoInfo, JSONData, StatsData } from "@/types/files";
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
import StatsArray from "@/components/StatsArray/StatsArray";
import { calculateCumulativeDistances } from "@/utils/calculateCumulativeDistances";
import { calculateCumulativeHits } from "@/utils/calculateCumulativeHits";
import Footer from "@/components/ui/Footer";

export default function VideoPage() {
    const params = useParams();
    const { activeLayers } = useActiveLayers();
    const { videos, setVideos } = useStore();
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [jsonData, setJsonData] = useState<JSONData | null>(null);
    const [statsData, setStatsData] = useState<StatsData | null>(null);
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
                    if (data?.jsonData) {
                        calculateCumulativeHits(data.jsonData);
                        calculateCumulativeDistances(data.jsonData);
                        
                        setJsonData(data.jsonData);
                        setStatsData(data.statsData);
                    }
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
        <div className="flex flex-col gap-32 md:gap-72 lg:gap-18 h-full w-full">
            <div className="flex flex-col p-4 h-screen">
                <div className="flex gap-6 h-full">
                    <BackBtn />
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-0 mt-2 h-full w-full">
                        <div className="flex flex-col gap-0 w-[470px] md:w-[750px] xl:w-[1050px] h-full">
                            <Layers jsonData={jsonData as JSONData} />
                            <div className="flex flex-col gap-4 lg:gap-2 w-full h-full">
                                <VideoPlayer
                                    currentVideo={currentVideo} 
                                    jsonData={jsonData as JSONData}
                                    activeLayers={activeLayers}
                                    statsData={statsData as StatsData}
                                />
                                {jsonData?.events && <AllTimelines events={jsonData.events} timeline={jsonData.timeline} />}
                            </div>
                        </div>
                        <ToolBox videoData={jsonData as JSONData} />
                    </div>
                </div>
            </div>
            <StatsArray statsData={statsData as StatsData} />
            <Footer />
        </div>
    );
}   