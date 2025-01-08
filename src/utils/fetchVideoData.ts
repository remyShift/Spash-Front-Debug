import { JSONData } from "@/types/files";

export const fetchVideoData = (videoPath: string): Promise<JSONData | null> => {
    return fetch(`/api/v1/files/${encodeURIComponent(videoPath)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data.jsonData;
        })
        .catch(err => {
            console.error("Erreur lors du chargement des données JSON:", err);
            return null;
        });
};