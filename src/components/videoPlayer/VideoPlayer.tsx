import { JSONData, VideoInfo } from '@/types/files';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useCallback, useEffect, useRef } from 'react';
import { drawPlayerBBox } from '@/utils/drawing/players/drawBboxPlayer';
import { defaultDrawingConfig, initializeAnimation } from '@/utils/drawing/config';
import { drawFramesNumber } from '@/utils/drawing/drawFrames';
import { Layers } from '@/types/layers';
import { drawBall } from '@/utils/drawing/ball/drawBall';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: Layers[];
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers }: VideoPlayerProps) => {
    const { videoRef, canvasRef, handlers, isVideoPlaying } = useVideoPlayer();
    const frameRequestRef = useRef<number | null>(null);

    const animate = useCallback(() => {
        if (!videoRef.current) return;
        if (!isVideoPlaying) return;

        const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef.current, jsonData);

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            if (!frameData || !videoWidth || !videoHeight || activeLayers.length === 0) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            } else {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                activeLayers.forEach(layer => {
                    drawFramesNumber(currentFrame, ctx, Object.keys(jsonData.data).length, defaultDrawingConfig);
                    switch (layer) {
                        case 'homography':
                            console.log(frameData);
                            break;
                        case 'players':
                            if (!frameData.persontracking) return;
                            Object.values(frameData.persontracking).forEach(player => {
                                drawPlayerBBox(player, videoWidth, videoHeight, ctx);
                            });
                            break;
                        case 'ball':
                            if (!frameData["ball.center.video"]) return;
                            drawBall(frameData["ball.center.video"], videoWidth, videoHeight, ctx);
                            break;
                        // case 'zones':
                        //     drawZones(frameData.zones, videoWidth, videoHeight, ctx);
                        //     break;
                    }
                });
            }
        }

        frameRequestRef.current = requestAnimationFrame(animate);
    }, [canvasRef, jsonData, videoRef, isVideoPlaying, activeLayers]);

    useEffect(() => {
        frameRequestRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
        };
    }, [animate]);

    return (
        <div className="relative w-[65%] h-full">
            <video
                ref={videoRef}
                src={currentVideo.videoPath}
                className="w-full h-full"
                controls
                onPlay={handlers.handlePlay}
                onPause={handlers.handlePause}
                onEnded={handlers.handleEnded}
                onLoadedMetadata={handlers.handleLoadedMetadata}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-50 pointer-events-none w-full h-full bg-red-500/20"
            />
        </div>
    );
};