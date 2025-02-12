import { JSONData } from "@/types/files";
import { Event } from "@/types/events";

export const filterEventsByPlayers = (
    frame: number,
    event: Event,
    jsonData: JSONData["data"],
    playersFilters: string[]
): boolean => {
    if (playersFilters.length === 0) return true;
    
    const frameData = jsonData[frame];
    if (!frameData?.persontracking) return false;

    return Object.values(frameData.persontracking).some(player => {
        if (!player.name || !playersFilters.includes(player.name)) return false;

        if (event === 'hits') return player.do_hit?.hit;
        if (event === 'services') return player.do_hit?.service;
        if (event === 'lobs') return player.do_hit?.lob;
        if (event === 'checks') return jsonData[frame].team_checks_players?.includes(player.name);

        return false;
    });
}; 