import { configureContext } from "../canvas";


export const drawNextReboundPrediction = (
    nextReboundCoordinates: [number, number],
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
) => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = nextReboundCoordinates;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    const crossSize = 30;
    context.save();

    context.strokeStyle = '#FF4F4F';
    context.lineWidth = 4;

    configureContext(context, { strokeStyle: context.strokeStyle, lineWidth: context.lineWidth });

    context.beginPath();
    context.moveTo(scaledX - crossSize/2, scaledY);
    context.lineTo(scaledX + crossSize/2, scaledY);
    context.moveTo(scaledX, scaledY - crossSize/2);
    context.lineTo(scaledX, scaledY + crossSize/2);
    context.stroke();

    context.restore();
}; 