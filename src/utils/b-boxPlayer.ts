export const drawSquare = (x: number, y: number, width: number, height: number, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const maxWidth = 800 - width;
            const maxHeight = 600 - height;
            const boundedX = Math.min(Math.max(0, x), maxWidth);
            const boundedY = Math.min(Math.max(0, y), maxHeight);

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(boundedX, boundedY, width, height);
        }
    }
};

export const generateSquareParams = () => {
    const width = Math.floor((Math.random() * 1920) / 800);
    const height = Math.floor((Math.random() * 1080) / 600);
    
    const maxX = 800 - width - 10;
    const maxY = 600 - height - 10;
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    
    return { x, y, width, height };
};