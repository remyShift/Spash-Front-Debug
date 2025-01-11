import { JSONData, VideoInfo } from '@/types/files';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useCallback, useEffect, useRef } from 'react';
import { drawPlayerBBox } from '@/utils/drawing/drawBboxPlayer';
import { defaultDrawingConfig } from '@/utils/drawing/config';
import { drawFramesNumber } from '@/utils/drawing/drawFrames';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
}

export const VideoPlayer = ({ currentVideo, jsonData }: VideoPlayerProps) => {
    const { videoRef, canvasRef, handlers, isPlaying } = useVideoPlayer();
    const frameRequestRef = useRef<number | null>(null);

    const animate = useCallback(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const fps = 25;
        const currentFrame = Math.round(video.currentTime * fps);
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const frameData = jsonData?.data[currentFrame];

        if (isPlaying) {
            console.log('Frame:', frameData);
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            if (!frameData || !videoWidth || !videoHeight) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            } else {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                drawFramesNumber(currentFrame, ctx, Object.keys(jsonData.data).length, defaultDrawingConfig);

                if (frameData.persontracking) {
                    Object.values(frameData.persontracking).forEach(player => {
                        drawPlayerBBox(player, videoWidth, videoHeight, ctx);
                    });
                }
            }
        }

        frameRequestRef.current = requestAnimationFrame(animate);
    }, [canvasRef, jsonData.data, videoRef, isPlaying]);

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