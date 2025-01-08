import { JSONData, VideoInfo } from '@/types/files';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
}

export const VideoPlayer = ({ currentVideo, jsonData }: VideoPlayerProps) => {
    const { videoRef, canvasRef, handlers } = useVideoPlayer(jsonData);

    return (
        <div className="relative h-full">
            <video
                ref={videoRef}
                src={currentVideo.videoPath}
                controls
                width="65%"
                height="100%"
                onPlay={handlers.handlePlay}
                onPause={handlers.handlePause}
                onEnded={handlers.handleEnded}
                onLoadedMetadata={handlers.handleLoadedMetadata}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-50 pointer-events-none w-[65%] h-full bg-red-500/20"
            />
        </div>
    );
};