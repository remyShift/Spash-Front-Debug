import { JSONData, StatsData } from "@/types/files";

export const fetchVideoData = (videoPath: string): Promise<{ jsonData: JSONData | null, statsData: StatsData | null }> => {
    return fetch(`/api/v1/files/${encodeURIComponent(videoPath)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error("Error loading JSON data:", err);
            return { jsonData: null, statsData: null };
        });
};