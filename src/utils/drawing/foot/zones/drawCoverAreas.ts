import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

export const drawCoverAreas = (
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        zone_1: [number, number][];
        zone_2: [number, number][];
        zone_3: [number, number][];
        zone_4: [number, number][];
    }
) => {
    const zonesConfig = [
        {
            name: "ZONE 1",
            points: zones.zone_1,
            color: "rgba(0, 0, 255, 0.2)",
            zoneKey: "zone_1"
        },
        {
            name: "ZONE 2",
            points: zones.zone_2,
            color: "rgba(0, 255, 0, 0.2)",
            zoneKey: "zone_2"
        },
        {
            name: "ZONE 3",
            points: zones.zone_3,
            color: "rgba(255, 0, 0, 0.2)",
            zoneKey: "zone_3"
        },
        {
            name: "ZONE 4",
            points: zones.zone_4,
            color: "rgba(255, 0, 255, 0.2)",
            zoneKey: "zone_4"
        }
    ];

    zonesConfig.forEach(zone => {        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted: false,
            displayText: zone.name
        });
    });
};
