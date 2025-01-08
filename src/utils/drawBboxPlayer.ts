interface FrameData {
    [key: string]: {
        rect: [number, number, number, number];
    };
}

interface JsonData {
    data: {
        [frame: number]: FrameData;
    };
}

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

export const drawPersonBBox = (
    frame: number,
    personId: string,
    jsonData: JsonData,
    videoWidth: number,
    videoHeight: number,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameData = jsonData.data[frame];
    if (!frameData || !frameData[`person${personId}.rect`]) return;

    const rect = frameData[`person${personId}.rect`].rect;
    const [x, y, width, height] = rect;

    const videoX = (x / 100) * videoWidth;
    const videoY = (y / 100) * videoHeight;
    const videoW = (width / 100) * videoWidth;
    const videoH = (height / 100) * videoHeight;

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(videoX, videoY, videoW, videoH);
};