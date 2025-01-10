import { BallLayer } from "@/types/layers";

export const drawBall = (ball: BallLayer, videoWidth: number, videoHeight: number, context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = ball.coordinates;
    const score = ball.score;
    
    context.beginPath();
    context.arc(x * scaleX, y * scaleY, 10, 0, 2 * Math.PI);
    context.lineWidth = 4;
    context.strokeStyle = 'red';
    context.stroke();

    context.font = 'bold 18px Arial';
    context.fillStyle = '#FFFFFF';
    const scoreText = `${score.toFixed(2)}`;
    context.fillText(scoreText, (x * scaleX) + 15, (y * scaleY) + 5);
}
