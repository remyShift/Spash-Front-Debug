import VideoBtn from "./VideoBtn";
import { VideoInfo } from "@/types/files";

export const VideoList = ({ videos }: { videos: VideoInfo[] }) => {
    return (
        <div className="flex flex-col gap-4">
            {videos.map((video) => (
                <div key={video.videoPath}>
                    <VideoBtn video={video} />
                </div>
            ))}
        </div>
    );
};