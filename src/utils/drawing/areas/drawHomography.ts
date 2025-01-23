export const drawHomography = (homography: number[][][], videoWidth: number, videoHeight: number, context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 2;

    homography.forEach(line => {
        context.beginPath();
        
        const [firstX, firstY] = line[0];
        context.moveTo(firstX * scaleX, firstY * scaleY);
        
        line.forEach(([x, y], index) => {
            if (index > 0) {
                context.lineTo(x * scaleX, y * scaleY);
            }
        });
        
        context.stroke();
    });
};