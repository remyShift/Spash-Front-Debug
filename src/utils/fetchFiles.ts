import { JSONData, VideoJSONPair } from "@/context/store";
import { VideoInfo } from "@/types/files";

type FetchFilesProps = {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setPairs: (pairs: VideoJSONPair[]) => void;
}

export const fetchFiles = ({ setLoading, setError, setPairs }: FetchFilesProps) => {

    setLoading(true);
    fetch("/api/v1/files")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const pairs = data.allVideos.map((video: VideoInfo) => {
                const matchingJson = data.allJSON.find(
                    (json: JSONData) => json.path === video.path
                );
                return {
                    video,
                    json: matchingJson || null
                };
            });
            console.log(pairs);
            setPairs(pairs);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur:", err);
            setError("Impossible de charger les fichiers.");
            setLoading(false);
        });
};