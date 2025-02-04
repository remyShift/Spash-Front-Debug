import { VideoInfo } from "@/types/files";

type FetchFilesProps = {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setVideos: (videos: VideoInfo[]) => void;
    videos: VideoInfo[];
    page?: number;
    limit?: number;
    setHasMore: (hasMore: boolean) => void;
}

interface FetchResponse {
    hasMore: boolean;
    pagination?: {
        hasMore: boolean;
    };
}

let fetchPromise: Promise<FetchResponse> | null = null;

export const fetchFiles = ({ setLoading, setError, setVideos, videos, page = 1, limit = 5, setHasMore }: FetchFilesProps) => {
    if (fetchPromise) {
        return fetchPromise;
    }

    setLoading(true);
    
    fetchPromise = fetch(`/api/v1/files?page=${page}&limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.allVideos.length === 0) {
                setHasMore(false);
                setLoading(false);
                return { hasMore: false };
            }
            setVideos(page === 1 ? data.allVideos : [...videos, ...data.allVideos]);
            setLoading(false);
            return data.pagination;
        })
        .catch(err => {
            console.error("Error:", err);
            setError("Can't load files.");
            setLoading(false);
            return { hasMore: false };
        })
        .finally(() => {
            fetchPromise = null;
        });

    return fetchPromise;
};