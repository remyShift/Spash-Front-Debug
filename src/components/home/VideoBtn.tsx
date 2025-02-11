import { VideoInfo } from "@/types/files";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface VideoBtnProps {
    video: VideoInfo;
    onDelete: (folderName: string) => void;
}

export default function VideoBtn({ video, onDelete }: VideoBtnProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this video ?")) {
            onDelete(video.folderName);
        }
    };

    return (
        <div className="w-full flex gap-4 items-center justify-center p-4 bg-slate-100 rounded-full hover:bg-primary transition-colors cursor-pointer group border-2 border-black">
            <Link
                href={`/debug/${encodeURIComponent(video.videoPath)}`}
                className="w-full flex gap-4 items-center justify-center"
            >
                <p className="text-primary group-hover:text-white font-semibold transition-colors">{video.folderName.toUpperCase()}</p>
                <p className="text-primary group-hover:text-white transition-colors font-semibold">{video.videoName}</p>
                <p className="text-sm text-gray-600 group-hover:text-white italic transition-colors">
                    Taille: {video.size > 1024 * 1024 * 1024 ? `${Math.round(video.size / 1024 / 1024 / 1024)} GB` : 
                        video.size > 1024 * 1024 ? `${Math.round(video.size / 1024 / 1024)} MB` : 
                        `${Math.round(video.size / 1024)} KB`}
                </p>
            </Link>
            <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 transition-colors"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}
