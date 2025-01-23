import { PersonTracking } from "@/types/files";
import { configureContext } from "../canvas";

interface TacticalZone {
    name: string;
    points: [number, number][];
    color: string;
}

export const drawAreas = (
    players: [string, PersonTracking][],
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        homography: number[][][];
        nomansland: [number, number][];
        attack: [number, number][];
        defense: [number, number][];
    }
) => {
    const canvas = context.canvas;
    configureContext(context);

    const HIGHLIGHT_DURATION = 25;
    const activeZones: { [key: string]: number } = {};

    const zonesConfig: TacticalZone[] = [
        {
            name: "ATTAQUE",
            points: zones.attack,
            color: "rgba(255, 0, 0, 0.2)"
        },
        {
            name: "NO MANS LAND",
            points: zones.nomansland,
            color: "rgba(255, 255, 0, 0.2)"
        },
        {
            name: "DEFENSE",
            points: zones.defense,
            color: "rgba(0, 255, 0, 0.2)"
        }
    ];

    zonesConfig.forEach(zone => {
        const scaledPoints = zone.points.map(([x, y]): [number, number] => [
            (x / videoWidth) * canvas.width,
            (y / videoHeight) * canvas.height
        ]);

        players.forEach(([, player]) => {
            const [playerX, playerY] = player.court_legs;
            const scaledX = (playerX / videoWidth) * canvas.width;
            const scaledY = (playerY / videoHeight) * canvas.height;
            
            if (isPointInPolygon(scaledX, scaledY, scaledPoints)) {
                activeZones[zone.name] = currentFrame;
            }
        });

        context.beginPath();
        context.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
        
        for (let i = 1; i < scaledPoints.length; i++) {
            context.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
        }
        context.closePath();

        const isZoneActive = activeZones[zone.name] && 
                           currentFrame - activeZones[zone.name] < HIGHLIGHT_DURATION;

        context.fillStyle = isZoneActive ? 
            zone.color.replace("0.2", "0.5") : 
            zone.color;
        context.fill();

        context.strokeStyle = zone.color.replace("0.2", "0.8");
        context.lineWidth = 2;
        context.stroke();

        scaledPoints.forEach(([x, y], index) => {
            context.beginPath();
            context.arc(x, y, 5, 0, 2 * Math.PI);
            context.fillStyle = "white";
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.stroke();

            const originalX = zone.points[index][0].toFixed(0);
            const originalY = zone.points[index][1].toFixed(0);
            context.font = "12px Arial";
            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.strokeText(`(${originalX},${originalY})`, x + 10, y);
            context.fillText(`(${originalX},${originalY})`, x + 10, y);
        });

        const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        context.fillText(zone.name, centerX, centerY);
    });
};

function isPointInPolygon(x: number, y: number, points: [number, number][]): boolean {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0], yi = points[i][1];
        const xj = points[j][0], yj = points[j][1];
        
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
} 