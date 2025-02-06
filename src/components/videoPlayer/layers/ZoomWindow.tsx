import { useEffect, useRef } from 'react';

interface ZoomWindowProps {
    x: number;
    y: number;
    videoRef: React.RefObject<HTMLVideoElement>;
    zoomFactor: number;
    size: number;
}

export default function ZoomWindow({ x, y, videoRef, zoomFactor = 4, size = 150 }: ZoomWindowProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const video = videoRef.current;

        if (!canvas || !ctx || !video) return;

        canvas.width = size;
        canvas.height = size;

        const sourceSize = size / zoomFactor;
        const sourceX = Math.max(0, Math.min(x * (video.videoWidth / video.clientWidth) - sourceSize / 2, video.videoWidth - sourceSize));
        const sourceY = Math.max(0, Math.min(y * (video.videoHeight / video.clientHeight) - sourceSize / 2, video.videoHeight - sourceSize));

        ctx.drawImage(
            video,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            size,
            size
        );

        ctx.beginPath();
        ctx.moveTo(size / 2 - 10, size / 2);
        ctx.lineTo(size / 2 + 10, size / 2);
        ctx.moveTo(size / 2, size / 2 - 10);
        ctx.lineTo(size / 2, size / 2 + 10);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
    }, [x, y, videoRef, zoomFactor, size]);

    const zoomPosition = {
        left: x + 20,
        top: y - size / 2
    };

    return (
        <canvas
        ref={canvasRef}
        className="absolute border-2 border-white rounded-lg shadow-lg"
        style={{
            left: zoomPosition.left,
            top: zoomPosition.top,
            width: size,
            height: size,
            pointerEvents: 'none'
        }}
        />
    );
} 