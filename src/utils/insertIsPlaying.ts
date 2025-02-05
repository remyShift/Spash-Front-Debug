import { JSONData } from "@/types/files";
import { TimelineInterval } from "@/types/events";

export const insertIsPlaying = (jsonData: JSONData["data"], timeline: TimelineInterval[]): void => {
    if (!timeline) return;
    Object.values(jsonData).forEach(frame => {
        frame.isPlaying = false;
    });

    Object.values(jsonData).forEach(frame => {
        timeline.forEach(interval => {
            if (frame.frame_idx >= interval.start && frame.frame_idx <= interval.end && interval.type === 'Point') {
                frame.isPlaying = true;
            }
        });
    });
};