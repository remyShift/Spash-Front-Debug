import { JSONData, PersonTracking } from "@/types/files";
import { calculateDistance } from "./calculateDistance";

export const insertCumulativeDistances = (data: JSONData): void => {
    const previousLegs: { [key: string]: [number, number] } = {};
    const cumulativeDistances: { [key: number]: number } = {};

    Object.keys(data.data)
        .sort((a, b) => Number(a) - Number(b))
        .forEach(frameIndex => {
            const frame = data.data[frameIndex];
            if (!frame.persontracking) return;

            Object.values(frame.persontracking).forEach((player: PersonTracking) => {
                if (!cumulativeDistances[player.id]) {
                    cumulativeDistances[player.id] = 0;
                }

                if (previousLegs[player.id]) {
                    const [prevX, prevY] = previousLegs[player.id];
                    const [currentX, currentY] = player.court_legs;
                    const distance = calculateDistance([prevX, prevY], [currentX, currentY]);
                    cumulativeDistances[player.id] += distance;
                    player.cumulate_distance = cumulativeDistances[player.id];
                }
                previousLegs[player.id] = player.court_legs;
            });
        });
} 