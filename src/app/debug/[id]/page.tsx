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
                    if (data) {
                        if (!data.jsonData) return;
                        const playersHits = data.jsonData.stats.players;

                        Object.values(data.jsonData.data).forEach(frame => {
                            if (frame.persontracking) {
                                Object.values(frame.persontracking).forEach(player => {
                                    player.do_hit = false;
                                    player.hit_type = undefined;
                                    const playerStats = playersHits[player.id];

                                    if (frame.detection === 'service') {
                                        if (playerStats.hits && playerStats.hits.includes(frame.frame_idx)) {
                                            player.do_hit = true;
                                            player.hit_type = 'service';
                                        }
                                    } else if (playerStats) {
                                        if (playerStats.hits && playerStats.hits.includes(frame.frame_idx)) {
                                            player.do_hit = true;
                                            player.hit_type = playerStats.lobs?.includes(frame.frame_idx) ? 'lob' : 'hit';
                                        }
                                    }
                                });
                            }
                        });

                        const previousLegs: { [key: string]: [number, number] } = {};

                        const cumulativeDistances: { [key: number]: number } = {};

                        Object.keys(data.jsonData.data).sort((a, b) => Number(a) - Number(b)).forEach(frameIndex => {
                            if (!data.jsonData) return;
                            const frame = data.jsonData.data[frameIndex];
                            if (frame.persontracking) {
                                Object.values(frame.persontracking).forEach(player => {
                                    if (!cumulativeDistances[player.id]) {
                                        cumulativeDistances[player.id] = 0;
                                    }

                                    if (previousLegs[player.id]) {
                                        const [prevX, prevY] = previousLegs[player.id];
                                        const [currentX, currentY] = player.court_legs;
                                        const distance = Math.sqrt(
                                            Math.pow(currentX - prevX, 2) + 
                                            Math.pow(currentY - prevY, 2)
                                        );
                                        cumulativeDistances[player.id] += distance;
                                        player.cumulate_distance = cumulativeDistances[player.id];
                                    }
                                    previousLegs[player.id] = player.court_legs;
                                });
                            }
                        });

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