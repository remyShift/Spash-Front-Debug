import { PersonTracking } from "@/types/files";
import { configureContext } from "../canvas";

interface TacticalZone {
    name: string;
    points: [number, number][];
    color: string;
}

const ZONES: TacticalZone[] = [
    {
        name: "ATTAQUE",
        points: [
            [0.5, 0.2],    // Haut gauche
            [0.6, 0.21],    // Haut droit
            [0.65, 1],   // Bas droit
            [0.5, 1]    // Bas gauche
        ],
        color: "rgba(255, 0, 0, 0.2)"
    },
    {
        name: "NO MANS LAND",
        points: [
            [0.6, 0.2],      // Haut gauche
            [0.65, 0.215],   // Point intermédiaire haut
            [0.72, 0.23],    // Haut droit
            [0.8, 0.4],      // Point milieu droit
            [0.9, 0.6],      // Point intermédiaire
            [0.95, 0.82],    // Bas droit
            [0.85, 0.92],      // Point intermédiaire bas
            [0.65, 1],    // Bas gauche
            [0.61, 0.4]      // Point intermédiaire gauche
        ],
        color: "rgba(255, 255, 0, 0.2)"
    },
    {
        name: "DEFENSE",
        points: [
            [0.72, 0.24],    // Haut gauche
            [0.75, 0.25],    // Point intermédiaire haut
            [0.8, 0.27],     // Haut droit
            [0.85, 0.35],    // Point intermédiaire haut droit
            [0.9, 0.45],     // Point milieu droit
            [0.93, 0.55],    // Point intermédiaire
            [0.96, 0.66],     // Bas droit
            [0.955, 0.75],   // Point intermédiaire bas
            [0.95, 0.82],    // Bas gauche
            [0.85, 0.5]      // Point milieu gauche
        ],
        color: "rgba(0, 255, 0, 0.2)"
    }
];

const HIGHLIGHT_DURATION = 25;
const activeZones: { [key: string]: number } = {};

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

export const drawAreas = (
    players: [string, PersonTracking][],
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
) => {
    const canvas = context.canvas;
    configureContext(context);

    ZONES.forEach(zone => {
        const scaledPoints = zone.points.map(([x, y]): [number, number] => [
            x * canvas.width,
            y * canvas.height
        ]);

        players.forEach(([, player]) => {
            const [playerX, playerY] = player.legs;
            const scaledX = (playerX / videoWidth) * canvas.width;
            const scaledY = (playerY / videoHeight) * canvas.height;
            
            if (isPointInPolygon(scaledX, scaledY, scaledPoints)) {
                activeZones[zone.name] = currentFrame;
            }
        });

        const isZoneActive = activeZones[zone.name] && 
                            currentFrame - activeZones[zone.name] < HIGHLIGHT_DURATION;

        context.beginPath();
        context.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
        for (let i = 1; i < scaledPoints.length; i++) {
            context.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
        }
        context.closePath();

        context.fillStyle = isZoneActive ? 
            zone.color.replace("0.2", "0.5") : 
            zone.color;
        context.fill();

        const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        context.fillText(zone.name, centerX, centerY);
    });
}; 