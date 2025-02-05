"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/context/store";
import { VideoInfo, JSONData, JSONStats } from "@/types/files";
import { fetchVideoData } from "@/utils/fetchVideoData";
import BackBtn from "@/components/ui/BackBtn";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { VideoPlayer } from "@/components/videoPlayer/VideoPlayer";
import Loader from "@/components/ui/Loader";
import { fetchFiles } from "@/utils/fetchFiles";
import { useActiveLayers } from "@/context/layers";
import ToolBox from "@/components/toolBox/ToolBox";
import AllTimelines from "@/components/timelines/AllTimelines";
import StatsArray from "@/components/StatsArray/StatsArray";
import { insertCumulativeDistances } from "@/utils/insertCumulativeDistances";
import { insertCumulativeHits } from "@/utils/insertCumulativeHits";
import Footer from "@/components/ui/Footer";
import PlayersPresenceTimeline from "@/components/PlayersPresenceTimeline/PlayersPresenceTimeline";
import { insertIsPlaying } from "@/utils/insertIsPlaying";

export default function VideoPage() {
    const params = useParams();
    const { activeLayers } = useActiveLayers();
    const { videos, setVideos } = useStore();
    const [currentVideo, setCurrentVideo] = useState<VideoInfo | null>(null);
    const [jsonData, setJsonData] = useState<JSONData | null>(null);
    const [statsData, setStatsData] = useState<JSONStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [dataInitialized, setDataInitialized] = useState(false);

    const paramsId = params.id;

    useEffect(() => {
        if (videos.length === 0) {
            setLoading(true);
            fetchFiles({ 
                setLoading, 
                setError, 
                setVideos, 
                videos, 
                page: 1, 
                limit: 5, 
                setHasMore: () => {} 
            }).then(() => {
                setLoading(false);
            });
        }
    }, [setVideos, videos.length, videos]);

    useEffect(() => {
        if (!paramsId || videos.length === 0 || !videos) return;

        const video = videos.find(v => v.videoPath === decodeURIComponent(paramsId as string));
        setCurrentVideo(video || null);

        if (video) {
            setLoading(true);
            setError("");

            fetchVideoData(video.videoPath)
                .then((data: { jsonData: JSONData, statsData: JSONStats }) => {
                    if (data?.jsonData?.data && data?.statsData?.players) {
                        insertCumulativeHits(data.jsonData);
                        insertCumulativeDistances(data.jsonData);
                        insertIsPlaying(data.jsonData.data, data.jsonData.timeline);
                        setJsonData(data.jsonData);
                        setStatsData(data.statsData); 
                        setDataInitialized(true);
                    } else {
                        const missingFiles = [];
                        if (!data?.jsonData?.data) missingFiles.push('JSON');
                        if (!data?.statsData?.players) missingFiles.push('Stats');
                        throw new Error(`Fichiers manquants ou invalides : ${missingFiles.join(' et ')}`);
                    }
                })
                .then(() => {
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

    if (!dataInitialized || !currentVideo || !jsonData || !statsData) {
        return (
            <div className="flex-1 justify-center items-center">
                <ErrorMsg error="Data not available" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-8 h-full w-full">
            <div className="flex flex-col p-4 h-screen">
                <div className="flex gap-6 h-full">
                    <BackBtn />
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mt-1 h-full w-full xl:pr-8">
                        <div className="flex flex-col gap-0 w-[100%] xl:w-[1050px] h-full">
                            <div className="flex flex-col gap-4 lg:gap-2 w-full h-full">
                                <VideoPlayer
                                    currentVideo={currentVideo} 
                                    jsonData={jsonData}
                                    activeLayers={activeLayers}
                                    statsData={statsData}
                                />
                                {(jsonData.events && jsonData.timeline) && (
                                    <AllTimelines 
                                        events={jsonData.events} 
                                        timeline={jsonData.timeline} 
                                        jsonData={jsonData.data} 
                                    />
                                )}
                            </div>
                        </div>
                        <ToolBox videoData={jsonData} />
                    </div>
                </div>
            </div>
            <PlayersPresenceTimeline jsonData={jsonData} />
            <StatsArray statsData={statsData} />
            <Footer />
        </div>
    );
}