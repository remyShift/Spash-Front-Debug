import { configureContext } from "./canvas";

interface ZonePolygonConfig {
    name: string;
    points: [number, number][];
    color: string;
    isHighlighted: boolean;
    displayText: string;
}

export const drawZonePolygon = (
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    config: ZonePolygonConfig
) => {
    const canvas = context.canvas;
    configureContext(context);
    if (config.points.length === 0) return;

    const scaledPoints = config.points.map(([x, y]): [number, number] => [
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

    const baseOpacity = config.isHighlighted ? 0.6 : 0.2;

    context.fillStyle = config.color.replace("0.2", baseOpacity.toString());
    context.shadowColor = config.color.replace("0.2", "1");
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = config.color.replace("0.2", "0.8");
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "white";
    context.font = "bold 18px Arial";
    context.textAlign = "center";
    const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
    const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;
    context.fillText(config.displayText, centerX, centerY);
}; 