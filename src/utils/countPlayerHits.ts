import { JSONData } from "@/types/files";

export const countPlayerHits = (data: JSONData['data'], playerId: number, currentFrame: number): number => {
    let hitCount = 0;
    
    for (let frame = 0; frame <= currentFrame; frame++) {
        if (data[frame]?.persontracking?.[playerId]?.do_hit) {
            hitCount++;
        }
    }
    
    return hitCount;
} 