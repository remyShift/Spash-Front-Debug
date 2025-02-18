import { JSONData } from "@/types/files";
import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

interface TopLobZone {
    name: string;
    points: [number, number][];
    color: string;
    zoneKey: 'top_lob_right' | 'top_lob_left';
}

export const drawTopLobZones = (
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    videoData: JSONData,
    zones: {
        top_lob_right: [number, number][];
        top_lob_left: [number, number][];
    }
) => {
    const zonesConfig: TopLobZone[] = [
        {
            name: "TOP LOB RIGHT",
            points: zones.top_lob_right,
            color: "rgba(255, 165, 0, 0.2)",
            zoneKey: "top_lob_right"
        },
        {
            name: "TOP LOB LEFT",
            points: zones.top_lob_left,
            color: "rgba(255, 165, 0, 0.2)",
            zoneKey: "top_lob_left"
        }
    ];

    zonesConfig.forEach(zone => {
        const isBallInZone = videoData.data[currentFrame]["ball.zones"]?.[zone.zoneKey];
        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted: isBallInZone ?? false,
            displayText: "TOP LOB"
        });
    });
};
