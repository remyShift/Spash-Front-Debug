import VideoBtn from "./VideoBtn";
import { VideoInfo } from "@/types/files";
import { fetchFiles } from "@/utils/fetchFiles";
import { useStore } from "@/context/store";

interface VideoListProps {
    videos: VideoInfo[];
    onDeleteVideo: (folderName: string) => void;
}

export const VideoList = ({ videos, onDeleteVideo }: VideoListProps) => {
    const { setVideos } = useStore();

    const handleDelete = (folderName: string) => {
        fetch(`/api/v1/files/delete?folder=${folderName}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when deleting video");
            }
            onDeleteVideo(folderName);
            
            fetchFiles({ 
                setLoading: () => {}, 
                setError: () => {}, 
                setVideos, 
                videos: [], 
                page: 1, 
                limit: 10,
                setHasMore: () => {} 
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while deleting the video");
        });
    };

    if (!Array.isArray(videos)) {
        return null;
    }

    return (
        <div className="w-fit flex flex-col gap-4">
            {videos.map((video) => (
                <div key={video.videoPath}>
                    <VideoBtn video={video} onDelete={handleDelete} />
                </div>
            ))}
        </div>
    );
};