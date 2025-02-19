import { PersonTracking } from "@/types/files";

export const getPlayersInZone = (
    players: [string, PersonTracking][],
    zoneName: string,
    teamFilter?: string[]
): number => {
    const playersInZone = players.filter(([, player]) => {
        const normalizedZoneName = zoneName.toLowerCase().replace(/\s+/g, '');
        return player.zones[normalizedZoneName as keyof typeof player.zones];
    });

    if (teamFilter) {
        return playersInZone.filter(([, player]) => 
            teamFilter.includes(player.name)
        ).length;
    }

    return playersInZone.length;
};