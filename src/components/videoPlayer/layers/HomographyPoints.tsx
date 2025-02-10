import { useHomographyPoints } from '@/context/homographyPoints';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveLayers } from '@/context/layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import ZoomWindow from './ZoomWindow';

export default function HomographyPoints({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();
    const dragRef = useRef<string | null>(null);
    const { activeLayers } = useActiveLayers();
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

    const handleMouseDown = (key: string) => {
        dragRef.current = key;
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragRef.current || !videoRef.current) return;

        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const rawX = (e.clientX - rect.left) * scaleX;
        const rawY = (e.clientY - rect.top) * scaleY;

        const videoScaleX = videoRef.current.videoWidth / canvas.width;
        const videoScaleY = videoRef.current.videoHeight / canvas.height;

        const x = rawX * videoScaleX;
        const y = rawY * videoScaleY;

        const clampedX = Math.max(0, Math.min(x, videoRef.current.videoWidth));
        const clampedY = Math.max(0, Math.min(y, videoRef.current.videoHeight));

        setHomographyPoints(Object.values({
            ...homographyPoints,
            [dragRef.current]: { 
                ...homographyPoints[dragRef.current],
                camera: [clampedX, clampedY] 
            }
        }));
    }, [homographyPoints, setHomographyPoints, videoRef]);

    const handleMouseUp = useCallback(() => {
        dragRef.current = null;
        setMousePos(null);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    if (!videoRef.current) return null;

    return (
        <div className={`absolute inset-0 pointer-events-none w-full h-full z-50 ${activeLayers.includes('homography') ? 'block' : 'hidden'}`}>
            {Object.entries(homographyPoints).map(([key, point]) => {
                const x = (point.camera[0] / videoRef.current!.videoWidth) * 100;
                const y = (point.camera[1] / videoRef.current!.videoHeight) * 100;
                
                return (
                    <FontAwesomeIcon
                        key={key}
                        icon={faCrosshairs}
                        className="absolute w-3 h-3 -translate-x-1/2 text-red-500 -translate-y-1/2 cursor-grab active:cursor-grabbing pointer-events-auto" 
                        style={{ left: `${x}%`, top: `${y}%` }} 
                        onMouseDown={() => handleMouseDown(key)}
                    />
                );
            })}
            
            {mousePos && dragRef.current && videoRef.current && (
                <ZoomWindow
                    x={mousePos.x}
                    y={mousePos.y}
                    videoRef={videoRef}
                    zoomFactor={4}
                    size={150}
                />
            )}
        </div>
    );
} 