import VideoBtn from "./VideoBtn";
import { VideoJSONPair } from "@/context/store";

export const VideoList = ({ pairs }: { pairs: VideoJSONPair[] }) => {
    return (
        <div className="flex flex-col gap-4">
            {pairs.map((pair) => (
                <div key={pair.video.videoPath}>
                    <VideoBtn pair={pair} />
                </div>
            ))}
        </div>
    );
};