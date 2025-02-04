import { JSONData, PersonTracking } from "@/types/files";

interface CumulativeHits {
    [playerId: string]: {
        service: number;
        lob: number;
        hit: number;
    };
}

interface PlayerStats {
    hits?: number[];
    lobs?: number[];
}

const initializePlayerHits = (playerId: string, cumulativeHits: CumulativeHits) => {
    if (!cumulativeHits[playerId]) {
        cumulativeHits[playerId] = {
            service: 0,
            lob: 0,
            hit: 0
        };
    }
};

const updatePlayerHitCount = (player: PersonTracking, cumulativeHits: CumulativeHits) => {
    const playerId = player.id.toString();
    player.hit_count = {
        service: cumulativeHits[playerId].service,
        lob: cumulativeHits[playerId].lob,
        hit: cumulativeHits[playerId].hit
    };
};

const handleServiceHit = (
    player: PersonTracking,
    frameIdx: number,
    playerStats: PlayerStats,
    cumulativeHits: CumulativeHits
) => {
    const playerId = player.id.toString();
    if (playerStats?.hits?.includes(frameIdx)) {
        player.do_hit.service = true;
        cumulativeHits[playerId].service++;
        player.hit_count.service = cumulativeHits[playerId].service;
    }
};

const handleNormalHit = (
    player: PersonTracking,
    frameIdx: number,
    playerStats: PlayerStats,
    cumulativeHits: CumulativeHits
) => {
    const playerId = player.id.toString();
    if (playerStats?.lobs?.includes(frameIdx)) {
        player.do_hit.lob = true;
        cumulativeHits[playerId].lob++;
        player.hit_count.lob = cumulativeHits[playerId].lob;
    } else if (playerStats?.hits?.includes(frameIdx)) {
        player.do_hit.hit = true;
        cumulativeHits[playerId].hit++;
        player.hit_count.hit = cumulativeHits[playerId].hit;
    }
};

export const calculateCumulativeHits = (jsonData: JSONData): void => {
    const cumulativeHits: CumulativeHits = {};
    const playersHits = jsonData.stats.players;

    Object.values(jsonData.data).forEach((frame) => {
        if (!frame.persontracking) return;

        Object.values(frame.persontracking).forEach(player => {
            const playerId = player.id.toString();
            
            initializePlayerHits(playerId, cumulativeHits);
            updatePlayerHitCount(player, cumulativeHits);
            
            player.do_hit = {
                service: false,
                lob: false,
                hit: false
            };
            const playerStats = playersHits[playerId];
            
            if (frame.detection?.toLowerCase() === 'service') {
                handleServiceHit(player, frame.frame_idx, playerStats, cumulativeHits);
            } else if (frame.detection?.toLowerCase() === 'hit') {
                handleNormalHit(player, frame.frame_idx, playerStats, cumulativeHits);
            }
        });
    });
}; 