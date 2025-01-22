"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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

    const cumulativeHitsRef = useRef<{ [playerId: string]: { service: number, lob: number, hit: number } }>({});

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
                        cumulativeHitsRef.current = {};
                        const playersHits = data.jsonData.stats.players;
                        
                        Object.values(data.jsonData.data).forEach((frame) => {
                            if (frame.persontracking) {
                                Object.values(frame.persontracking).forEach(player => {
                                    const playerId = player.id.toString();
                                    
                                    if (!cumulativeHitsRef.current[playerId]) {
                                        cumulativeHitsRef.current[playerId] = {
                                            service: 0,
                                            lob: 0,
                                            hit: 0
                                        };
                                    }
                                    
                                    player.hit_count = {
                                        service: cumulativeHitsRef.current[playerId].service,
                                        lob: cumulativeHitsRef.current[playerId].lob,
                                        hit: cumulativeHitsRef.current[playerId].hit
                                    };
                                    
                                    player.do_hit = false;
                                    const playerStats = playersHits[playerId];
                                    
                                    if (frame.detection?.toLowerCase() === 'service') {
                                        if (playerStats?.hits?.includes(frame.frame_idx)) {
                                            player.do_hit = true;
                                            cumulativeHitsRef.current[playerId].service++;
                                            player.hit_count.service = cumulativeHitsRef.current[playerId].service;
                                        }
                                    } else if (frame.detection?.toLowerCase() === 'hit') {
                                        if (playerStats?.lobs?.includes(frame.frame_idx)) {
                                            player.do_hit = true;
                                            cumulativeHitsRef.current[playerId].lob++;
                                            player.hit_count.lob = cumulativeHitsRef.current[playerId].lob;
                                        } else if (playerStats?.hits?.includes(frame.frame_idx)) {
                                            player.do_hit = true;
                                            cumulativeHitsRef.current[playerId].hit++;
                                            player.hit_count.hit = cumulativeHitsRef.current[playerId].hit;
                                        }
                                    }
                                });
                            }
                        });

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
        <div className="flex flex-col gap-12 h-full w-full">
            <div className="flex flex-col gap-4 p-4 h-screen">
                <div className="flex gap-6 h-full">
                    <BackBtn />
                    <div className="flex justify-center gap-24 mt-2 h-full w-full">
                        <div className="flex flex-col gap-0 w-fit h-full">
                            <Layers />
                            <div className="flex flex-col gap-2 w-full h-full">
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
        </div>
    );
}   