import { JSONData } from "@/types/files";
import { useEffect, useRef } from "react";
import { useFrame } from "@/context/frame";

export default function HomographyRadar({ framesData }: { framesData: JSONData['data'] }) {
    const width = 350;
    const height = width * 2;
    const serviceLineHeight = height * (3/20);
    const middleLineHeight = height * 0.5;

    const canvas = useRef<HTMLCanvasElement>(null);
    const currentFrame = useFrame(state => state.currentFrame);

    useEffect(() => {
        if (!canvas.current) return;
        
        // Définir les dimensions du canvas
        canvas.current.width = width;
        canvas.current.height = height;
        
        const ctx = canvas.current.getContext('2d');
        if (!ctx) return;

        const frameData = framesData[currentFrame];
        ctx.clearRect(0, 0, width, height);
        
        if (!frameData?.persontracking) return;
        
        // Dessiner tous les joueurs
        Object.entries(frameData.persontracking).forEach(([, player]) => {
            if (!player?.court_legs) return;
            
            const [x, y] = player.court_legs;
            const radarX = x / 10 * width;
            const radarY = y / 20 * height;

            ctx.beginPath();
            ctx.arc(radarX, radarY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = player.name === 'A' || player.name === 'B' ? '#FF0000' : '#0000FF';
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.name || '', radarX, radarY - 10);
        });
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

                <div className='absolute top-0 left-0 w-1/2 border-b border-primary'
                    style={{ height: `${serviceLineHeight}px` }}></div>
                <div className='absolute bottom-0 right-0 w-1/2 border-t border-primary'
                    style={{ height: `${serviceLineHeight}px` }}></div>

                <canvas ref={canvas} width={width} height={height} className='absolute inset-0 bg-red-500/10'></canvas>
            </div>
        </div>
    )
}