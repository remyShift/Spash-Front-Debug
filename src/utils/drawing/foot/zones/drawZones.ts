import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

export const drawZones = (
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        zone_left: [number, number][];
        zone_mid: [number, number][];
        zone_right: [number, number][];
    }
) => {
    const zonesConfig = [
        {
            name: "ZONE LEFT",
            points: zones.zone_left,
            color: "rgba(255, 0, 0, 0.2)",
            zoneKey: "zone_left"
        },
        {
            name: "ZONE MID",
            points: zones.zone_mid,
            color: "rgba(0, 255, 0, 0.2)",
            zoneKey: "zone_mid"
        },
        {
            name: "ZONE RIGHT",
            points: zones.zone_right,
            color: "rgba(0, 0, 255, 0.2)",
            zoneKey: "zone_right"
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
