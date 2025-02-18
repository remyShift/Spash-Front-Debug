import { JSONData } from "@/types/files";
import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

interface SafeBallZone {
    name: string;
    points: [number, number][];
    color: string;
    zoneKey: 'safe_ball_right' | 'safe_ball_left';
}

export const drawSafeBallZones = (
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    videoData: JSONData,
    zones: {
        balle_sure_right: [number, number][];
        balle_sure_left: [number, number][];
    }
) => {
    const zonesConfig: SafeBallZone[] = [
        {
            name: "BALLE SURE RIGHT",
            points: zones.balle_sure_right,
            color: "rgba(0, 255, 255, 0.2)",
            zoneKey: "safe_ball_right"
        },
        {
            name: "BALLE SURE LEFT",
            points: zones.balle_sure_left,
            color: "rgba(0, 255, 255, 0.2)",
            zoneKey: "safe_ball_left"
        }
    ];

    zonesConfig.forEach(zone => {
        const isBallInZone = videoData.data[currentFrame]["ball.zones"]?.[zone.zoneKey];
        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted: isBallInZone ?? false,
            displayText: "BALLE SURE"
        });
    });
};