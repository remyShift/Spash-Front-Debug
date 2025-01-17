import { JSONData } from "@/types/files";

export const getNextReboundFrame = (data: JSONData['data'], currentFrame: number): number | null => {
    const frames = Object.keys(data).map(Number);
    const nextFrames = frames.filter(frame => 
        frame > currentFrame && 
        data[frame]?.detection === "Rebound"
    );
    
    return nextFrames.length > 0 ? nextFrames[0] : null;
} 