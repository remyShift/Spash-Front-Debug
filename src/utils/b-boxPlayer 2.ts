export const drawSquare = (x: number, y: number, width: number, height: number, videoWidth: number, videoHeight: number, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const maxWidth = videoWidth - width;
            const maxHeight = videoHeight - height;
            const boundedX = Math.min(Math.max(0, x), maxWidth);
            const boundedY = Math.min(Math.max(0, y), maxHeight);

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(boundedX, boundedY, width, height);
        }
    }
};

export const generateSquareParams = (videoWidth: number, videoHeight: number) => {
    const squareSize = 100;

    const maxX = videoWidth - squareSize;
    const maxY = videoHeight - squareSize;
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    return { 
        x, 
        y, 
        width: squareSize, 
        height: squareSize 
    };
};