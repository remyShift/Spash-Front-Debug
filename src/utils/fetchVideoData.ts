import { JSONData, JSONStats } from "@/types/files";

export async function fetchVideoData(videoPath: string): Promise<{ 
    jsonData: JSONData; 
    statsData: JSONStats; 
}> {
    return fetch(`/api/v1/files/${encodeURIComponent(videoPath)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            if (!data) {
                console.error("No data received from API");
                return { jsonData: null, statsData: null };
            }

            const hasValidJsonData = data.jsonData && 
                                    data.jsonData.data && 
                                    Object.keys(data.jsonData.data).length > 0;

            const hasValidStatsData = data.statsData && 
                                    data.statsData.players && 
                                    Array.isArray(data.statsData.players);

            if (!hasValidJsonData || !hasValidStatsData) {
                const missingParts = [];
                if (!hasValidJsonData) missingParts.push('JSON data');
                if (!hasValidStatsData) missingParts.push('Stats data');
                console.error("Missing or invalid data parts:", missingParts);
                return { jsonData: null, statsData: null };
            }

            return data;
        })
        .catch(err => {
            console.error("Error in fetchVideoData:", err);
            return { jsonData: null, statsData: null };
        });
};