import { VideoInfo } from "@/types/files";

type FetchFilesProps = {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setVideos: (videos: VideoInfo[]) => void;
}

export const fetchFiles = ({ setLoading, setError, setVideos }: FetchFilesProps) => {
    setLoading(true);
    fetch("/api/v1/files")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setVideos(data.allVideos);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur:", err);
            setError("Impossible de charger les fichiers.");
            setLoading(false);
        });
};