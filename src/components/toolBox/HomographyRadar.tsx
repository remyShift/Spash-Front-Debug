import { useEffect, useRef } from 'react';
import { drawCourt, drawPlayers } from '@/utils/drawing/radar/drawRadar';
import { JSONData } from '@/types/files';
import { useFrame } from '@/context/frame';
;

export default function HomographyRadar({framesData}: {framesData: JSONData['data']}) {
    const width = 350;
    const height = width * 2;
    const serviceLineHeight = height * (3/20);
    const middleLineHeight = height * 0.5;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentFrame = useFrame(state => state.currentFrame);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const frameData = framesData[currentFrame];
        drawCourt(width, height, serviceLineHeight, middleLineHeight, ctx);
        drawPlayers(frameData, width, height, ctx);
    }, [framesData, width, height, serviceLineHeight, middleLineHeight, currentFrame]);

    return (
        <div className='flex flex-col gap-2 items-center justify-center py-4'>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className='bg-gray-500'
            />
        </div>
    );
}