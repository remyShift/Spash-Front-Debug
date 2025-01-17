import { BallLayer } from "@/types/layers";
import { configureContext } from "../canvas";
import { calculateDistance } from "../../calculateDistance";

const TRAIL_LENGTH = 25;
const MIN_OPACITY = 0.1;
const MAX_DISTANCE = 100;

interface TrailPoint {
    x: number;
    y: number;
    frame: number;
}

const ballTrail: TrailPoint[] = [];

export const drawBallTrajectory = (
    ball: BallLayer,
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = ball.coordinates;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    const newPoint = {
        x: scaledX,
        y: scaledY,
        frame: currentFrame
    };

    if (ballTrail.length > 0) {
        const lastPoint = ballTrail[ballTrail.length - 1];
        const distance = calculateDistance([newPoint.x, newPoint.y], [lastPoint.x, lastPoint.y]);
        
        if (distance > MAX_DISTANCE) {
            ballTrail.length = 0;
        }
    }

    ballTrail.push(newPoint);

    while (ballTrail.length > 0 && currentFrame - ballTrail[0].frame > TRAIL_LENGTH) {
        ballTrail.shift();
    }

    if (ballTrail.length < 2) return;

    configureContext(context);

    context.beginPath();
    context.moveTo(ballTrail[0].x, ballTrail[0].y);
    context.lineWidth = 3;

    for (let i = 1; i < ballTrail.length; i++) {
        const point = ballTrail[i];
        const progress = (currentFrame - point.frame) / TRAIL_LENGTH;
        const opacity = Math.max(1 - progress, MIN_OPACITY);

        context.strokeStyle = `#FFD700${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        context.lineTo(point.x, point.y);
        context.stroke();
        context.beginPath();
        context.moveTo(point.x, point.y);
    }
} 