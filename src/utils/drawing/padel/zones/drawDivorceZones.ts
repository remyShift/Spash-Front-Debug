import { configureContext } from "../../canvas";
import { JSONData, PersonTracking } from "@/types/files";

interface DivorceZone {
    name: string;
    points: [number, number][];
    color: string;
    zoneKey: 'divorce_zone_right' | 'divorce_zone_left';
}

export const drawDivorceZones = (
    players: [string, PersonTracking][],
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
    const canvas = context.canvas;
    configureContext(context);

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
        if (zone.points.length === 0) return;

        const scaledPoints = zone.points.map(([x, y]): [number, number] => [
            (x / videoWidth) * canvas.width,
            (y / videoHeight) * canvas.height
        ]);

        context.beginPath();
        context.moveTo(scaledPoints[0][0], scaledPoints[0][1]);

        for (let i = 1; i < scaledPoints.length; i++) {
            context.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
        }

        context.lineTo(scaledPoints[0][0], scaledPoints[0][1]);
        context.closePath();

        const isBallInZone = videoData.data[currentFrame]["ball.zones"]?.[zone.zoneKey];
        const baseOpacity = isBallInZone ? 0.6 : 0.2;

        context.fillStyle = zone.color.replace("0.2", baseOpacity.toString());
        context.shadowColor = zone.color.replace("0.2", "1");
        context.fill();

        context.shadowBlur = 0;
        context.strokeStyle = zone.color.replace("0.2", "0.8");
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;
        context.fillText("DIVORCE", centerX, centerY);
    });
};
