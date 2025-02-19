import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

export const drawCorridors = (
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        top_corridor: [number, number][];
        mid_corridor: [number, number][];
        bottom_corridor: [number, number][];
    }
) => {
    const zonesConfig = [
        {
            name: "CORRIDOR BOTTOM",
            points: zones.bottom_corridor,
            color: "rgba(255, 0, 0, 0.2)",
            zoneKey: "bottom_corridor"
        },
        {
            name: "CORRIDOR MID",
            points: zones.mid_corridor,
            color: "rgba(0, 255, 0, 0.2)",
            zoneKey: "mid_corridor"
        },
        {
            name: "CORRIDOR TOP",
            points: zones.top_corridor,
            color: "rgba(0, 0, 255, 0.2)",
            zoneKey: "top_corridor"
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
