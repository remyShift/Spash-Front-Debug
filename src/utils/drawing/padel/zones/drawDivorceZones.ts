import { JSONData } from "@/types/files";
import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

interface DivorceZone {
    name: string;
    points: [number, number][];
    color: string;
    zoneKey: 'divorce_zone_right' | 'divorce_zone_left';
}

export const drawDivorceZones = (
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    videoData: JSONData,
    zones: {
        divorce_right: [number, number][];
        divorce_left: [number, number][];
    }
) => {
    const zonesConfig: DivorceZone[] = [
        {
            name: "DIVORCE RIGHT",
            points: zones.divorce_right,
            color: "rgba(255, 0, 255, 0.2)",
            zoneKey: "divorce_zone_right"
        },
        {
            name: "DIVORCE LEFT",
            points: zones.divorce_left,
            color: "rgba(255, 0, 255, 0.2)",
            zoneKey: "divorce_zone_left"
        }
    ];

    zonesConfig.forEach(zone => {
        const isBallInZone = videoData.data[currentFrame]["ball.zones"]?.[zone.zoneKey];
        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted: isBallInZone ?? false,
            displayText: "DIVORCE"
        });
    });
};
