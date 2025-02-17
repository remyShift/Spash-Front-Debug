import { JSONData, PersonTracking } from '@/types/files';

interface ZoneHistory {
    [playerId: string]: {
        nomansland: number[];
        attack: number[];
        defense: number[];
    };
}

const initializePlayerZoneHistory = (playerId: string, zoneHistory: ZoneHistory) => {
    if (!zoneHistory[playerId]) {
        zoneHistory[playerId] = {
            nomansland: [],
            attack: [],
            defense: []
        };
    }
};

const updatePlayerZoneHistory = (
    player: PersonTracking, 
    frameIdx: number,
    zoneHistory: ZoneHistory
) => {
    if (!player.id) return;
    const playerId = player.id.toString();

    if (player.zones.nomansland) {
        zoneHistory[playerId].nomansland.push(frameIdx);
    }
    if (player.zones.attack) {
        zoneHistory[playerId].attack.push(frameIdx);
    }
    if (player.zones.defense) {
        zoneHistory[playerId].defense.push(frameIdx);
    }

    player.zone_count = {
        nomansland: zoneHistory[playerId].nomansland.length,
        attack: zoneHistory[playerId].attack.length,
        defense: zoneHistory[playerId].defense.length
    };
};

export const insertZoneCount = (jsonData: JSONData): void => {
    const zoneHistory: ZoneHistory = {};

    Object.values(jsonData.data).forEach((frame) => {
        if (!frame.persontracking) return;

        Object.values(frame.persontracking).forEach(player => {
            if (!player.id) return;
            const playerId = player.id.toString();
            
            initializePlayerZoneHistory(playerId, zoneHistory);
            updatePlayerZoneHistory(player, frame.frame_idx, zoneHistory);
        });
    });
}; 