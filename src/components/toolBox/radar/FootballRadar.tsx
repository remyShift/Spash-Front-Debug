import { JSONData } from "@/types/files";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@/context/frame";
import { drawRadar } from "@/utils/drawing/drawRadar";

interface FieldSize {
    width: number;
    height: number;
    goalWidth: number;
}

export default function FootballRadar({ framesData, fieldSize }: { 
    framesData: JSONData['data'], 
    fieldSize: FieldSize 
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const currentFrame = useFrame(state => state.currentFrame);

    const dimensions = useMemo<FieldSize>(() => {
        const realRatio = fieldSize.width / fieldSize.height;
        const baseWidth = 320;
        const height = baseWidth / realRatio;
        const goalRatio = fieldSize.goalWidth / fieldSize.width;
        
        return {
            width: baseWidth,
            height: height,
            goalWidth: baseWidth * goalRatio
        };
    }, [fieldSize.width, fieldSize.height, fieldSize.goalWidth]);

    useEffect(() => {
        if (!canvas.current) return;
        drawRadar(framesData, currentFrame, canvas.current, dimensions.width, dimensions.height);
    }, [framesData, dimensions.width, dimensions.height, currentFrame]);

    const middleLineY = dimensions.height / 2;

    return (
        <div ref={containerRef} className='flex flex-col gap-2 items-center justify-center py-4'>
            <div className='relative bg-green-800/80 foot-radar-border' style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
                <div className='absolute inset-0 border-2 border-white'></div>
                
                <div className='absolute left-0 right-0 h-0.5 bg-white'
                    style={{ top: `${middleLineY}px` }}></div>

                <div className='absolute top-0 h-2 w-1 bg-white'
                    style={{ left: `${(dimensions.width - dimensions.goalWidth) / 2}px` }}></div>
                <div className='absolute top-0 h-2 w-1 bg-white'
                    style={{ left: `${(dimensions.width + dimensions.goalWidth) / 2}px` }}></div>

                <div className='absolute bottom-0 h-2 w-1 bg-white'
                    style={{ left: `${(dimensions.width - dimensions.goalWidth) / 2}px` }}></div>
                <div className='absolute bottom-0 h-2 w-1 bg-white'
                    style={{ left: `${(dimensions.width + dimensions.goalWidth) / 2}px` }}></div>

                <canvas ref={canvas} width={dimensions.width} height={dimensions.height} className='absolute inset-0'></canvas>
            </div>
        </div>
    );
} 