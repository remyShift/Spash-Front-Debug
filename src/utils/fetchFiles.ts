import { VideoInfo } from "@/types/files";

type FetchFilesProps = {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setVideos: (videos: VideoInfo[]) => void;
    setJSON: (json: object[]) => void;
}

export const fetchFiles = ({ setLoading, setError, setVideos, setJSON }: FetchFilesProps) => {

    setLoading(true);
    fetch("/api/v1/files")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const fetchedVideos = data.allVideos;
            setVideos(fetchedVideos);

            const fetchedJSON = data.allJSON;
            setJSON(fetchedJSON);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error:", err);
            setError("Impossible de charger les fichiers.");
            setLoading(false);
        });
};