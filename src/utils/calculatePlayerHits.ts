import { JSONData } from "@/types/files";

export const calculatePlayerHits = (data: JSONData): void => {
    const playersHits = data.stats.players;

    Object.values(data.data).forEach(frame => {
        if (!frame.persontracking) return;

        Object.values(frame.persontracking).forEach(player => {
            player.do_hit = false;
            player.hit_type = undefined;
            const playerStats = playersHits[player.id];

            if (frame.detection === 'service') {
                if (playerStats?.hits?.includes(frame.frame_idx)) {
                    player.do_hit = true;
                    player.hit_type = 'service';
                }
            } else if (playerStats?.hits?.includes(frame.frame_idx)) {
                player.do_hit = true;
                player.hit_type = playerStats.lobs?.includes(frame.frame_idx) ? 'lob' : 'hit';
            }
        });
    });
}; 