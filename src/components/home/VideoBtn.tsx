import { VideoInfo } from "@/types/files";

export default function VideoBtn({ video }: { video: VideoInfo }) {
    return (
        <a
            href={`/debug/${encodeURIComponent(video.videoPath)}`}
            key={video.videoPath}
            className="w-full flex gap-4 items-center justify-center p-4 bg-tertiary rounded-full hover:bg-primary transition-colors cursor-pointer group border-2 border-black"
        >
                <p className="text-primary group-hover:text-white font-semibold transition-colors">{video.folderName.toUpperCase()}</p>
                <p className="text-primary group-hover:text-white transition-colors font-semibold">{video.videoName}</p>
                <p className="text-sm text-gray-600 group-hover:text-white italic transition-colors">
                    Taille: {Math.round(video.size / 1024)} KB
                </p>
        </a>
    );
}
