import { BallLayer } from "@/types/layers";

export const drawBall = (ball: BallLayer, videoWidth: number, videoHeight: number, context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = ball.coordinates;
    const score = ball.score;
    
    const offsetX = 0.5;
    const offsetY = 0.5;
    
    const adjustedX = (x + offsetX) * scaleX;
    const adjustedY = (y + offsetY) * scaleY;
    
    context.save();
    context.beginPath();
    context.arc(adjustedX, adjustedY, 10, 0, 2 * Math.PI);
    context.lineWidth = 4;
    context.strokeStyle = 'yellow';
    context.stroke();

    context.shadowColor = 'yellow';
    context.shadowBlur = 5;
    context.stroke();
    context.restore();

    context.font = 'bold 18px Arial';
    context.fillStyle = '#FFFFFF';
    const scoreText = `${score.toFixed(2)}`;
    context.fillText(scoreText, adjustedX + 15, adjustedY + 5);

    if (ball.speed) {
        context.font = 'bold 18px Arial';
        context.fillStyle = '#FFFFFF';
        const speedText = `${ball.speed.toFixed(2)} km/h`;
        context.fillText(speedText, adjustedX + 15, adjustedY + 25);
    }
}