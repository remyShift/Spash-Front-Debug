export const drawBall = (ball: number[], videoWidth: number, videoHeight: number, context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = ball;
    context.beginPath();
    context.arc(x * scaleX, y * scaleY, 10, 0, 2 * Math.PI);
    context.lineWidth = 4;
    context.strokeStyle = 'red';
    context.stroke();
}
