import { JSONData } from "@/types/files";
import { useEffect, useRef } from "react";
import { useFrame } from "@/context/frame";
import { drawRadar } from "@/utils/drawing/radar/drawRadar";

export default function HomographyRadar({ framesData }: { framesData: JSONData['data'] }) {
    const width = 280;
    const height = width * 2;
    const serviceLineHeight = height * (3/20);
    const middleLineHeight = height * 0.5;

    const canvas = useRef<HTMLCanvasElement>(null);
    const currentFrame = useFrame(state => state.currentFrame);

    useEffect(() => {
        if (!canvas.current) return;
        drawRadar(framesData, currentFrame, canvas.current, width, height);
    }, [framesData, width, height, currentFrame]);

    return (
        <div className='flex flex-col gap-2 items-center justify-center py-4'>
            <div className='relative' style={{ width: `${width}px`, height: `${height}px` }}>
                <div className='absolute inset-0 border-2 border-primary'></div>
                
                <div className='absolute left-1/2 w-0.5 bg-primary'
                    style={{ 
                        top: `${serviceLineHeight}px`,
                        height: `${height - (2 * serviceLineHeight)}px`
                    }}></div>

                <div className='absolute top-0 left-0 right-0 h-0.5 bg-primary' 
                    style={{ top: `${serviceLineHeight}px` }}></div>
                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' 
                    style={{ bottom: `${serviceLineHeight}px` }}></div>

                <div className='absolute top-0 left-0 right-0 h-0.5 bg-white' 
                    style={{ top: `${middleLineHeight}px` }}></div>

                <div className='absolute top-0 left-0 w-1/2 border-primary'
                    style={{ height: `${serviceLineHeight}px` }}></div>
                <div className='absolute bottom-0 right-0 w-1/2 border-primary'
                    style={{ height: `${serviceLineHeight}px` }}></div>

                <canvas ref={canvas} width={width} height={height} className='absolute inset-0 bg-red-500/10'></canvas>
            </div>
        </div>
    );
}