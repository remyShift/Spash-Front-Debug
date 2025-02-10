import { JSONData } from "@/types/files";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@/context/frame";
import { drawRadar } from "@/utils/drawing/drawRadar";

export default function PadelHomographyRadar({ framesData }: { framesData: JSONData['data'] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const currentFrame = useFrame(state => state.currentFrame);
    const [dimensions, setDimensions] = useState({ width: 280, height: 560 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const width = Math.min(containerWidth * 0.9, 280);
                setDimensions({
                    width: width,
                    height: width * 2
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    const serviceLineHeight = dimensions.height * (3/20);
    const middleLineHeight = dimensions.height * 0.5;

    useEffect(() => {
        if (!canvas.current) return;
        drawRadar(framesData, currentFrame, canvas.current, dimensions.width, dimensions.height);
    }, [framesData, dimensions.width, dimensions.height, currentFrame]);

    return (
        <div ref={containerRef} className='flex flex-col gap-2 items-center justify-center py-4'>
            <div className='relative bg-blue-700/80' style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
                <div className='absolute inset-0 border-2 border-white'></div>
                
                <div className='absolute left-1/2 w-0.5 bg-white'
                    style={{ 
                        top: `${serviceLineHeight}px`,
                        height: `${dimensions.height - (2 * serviceLineHeight)}px`
                    }}></div>

                <div className='absolute top-0 left-0 right-0 h-0.5 bg-white' 
                    style={{ top: `${serviceLineHeight}px` }}></div>
                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-white' 
                    style={{ bottom: `${serviceLineHeight}px` }}></div>

                <div className='absolute top-0 left-0 right-0 h-0.5 bg-white' 
                    style={{ top: `${middleLineHeight}px` }}></div>

                <div className='absolute top-0 left-0 w-1/2 border-white'
                    style={{ height: `${serviceLineHeight}px` }}></div>
                <div className='absolute bottom-0 right-0 w-1/2 border-white'
                    style={{ height: `${serviceLineHeight}px` }}></div>

                <canvas ref={canvas} width={dimensions.width} height={dimensions.height} className='absolute inset-0'></canvas>
            </div>
        </div>
    );
}