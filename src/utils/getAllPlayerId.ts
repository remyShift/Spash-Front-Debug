import { JSONData } from "@/types/files";

export const getAllPlayerId = (videoData: JSONData) => {
    const frames = Object.keys(videoData.data);
    const allPlayerIds = new Set<number>();
    
    frames.forEach((frame) => {
        const players = Object.values(videoData.data[frame]?.persontracking || {});
        players.forEach(player => {
            if (player.id) {
                allPlayerIds.add(player.id);
            }
        });
    });
    
    return Array.from(allPlayerIds);
};
