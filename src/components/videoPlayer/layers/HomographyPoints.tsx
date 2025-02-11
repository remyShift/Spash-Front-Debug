import { useHomographyPoints } from '@/context/homographyPoints';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveLayers } from '@/context/layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import ZoomWindow from './ZoomWindow';
import { fetchHomography } from '@/utils/fetchHomography';
import { drawHomography } from '@/utils/drawing/drawHomography';
import { useSport } from '@/context/sport';
import { JSONData } from '@/types/files';
import { useEditMode } from '@/context/editMode';

export default function HomographyPoints({ videoRef, videoData }: { 
    videoRef: React.RefObject<HTMLVideoElement>;
    videoData: JSONData;
}) {
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();
    const dragRef = useRef<string | null>(null);
    const { activeLayers } = useActiveLayers();
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);
    const { currentSport } = useSport();
    const originalPointsRef = useRef(videoData.info.homography);
    const { editMode } = useEditMode();

    useEffect(() => {
        if (activeLayers.includes('homography')) {
            setHomographyPoints(originalPointsRef.current);
        }
    }, [activeLayers, setHomographyPoints]);

    const updateHomography = useCallback(async () => {
        if (!videoRef.current || !editMode) return;

        const homographyData = Object.values(homographyPoints).map(point => ({
            name: point.name,
            camera: point.camera,
            object: point.object || [0, 0]
        }));

        const response = await fetchHomography({
            camera: homographyData.map(point => point.camera),
            height: videoData.info.video.height,
            width: videoData.info.video.width,
            sport: currentSport
        });

        if (response?.code === 0 && response?.data?.homography) {
            const mainCanvas = document.querySelector('canvas');
            if (mainCanvas) {
                const context = mainCanvas.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                    drawHomography(
                        response.data.homography,
                        videoRef.current.videoWidth,
                        videoRef.current.videoHeight,
                        context
                    );
                }
            }
        } else {
            console.error('Réponse homographie invalide:', response);
        }
    }, [homographyPoints, videoRef, currentSport, videoData.info.video.height, videoData.info.video.width, editMode]);

    const handleMouseDown = (key: string) => {
        if (!editMode) return;
        dragRef.current = key;
        setMousePos(null);
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
        if (dragRef.current) {
            updateHomography();
        }
        dragRef.current = null;
        setMousePos(null);
    }, [updateHomography]);

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
                
                if (point.camera[0] === -1 || point.camera[1] === -1) return null;

                return (
                    <div key={key} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
                        <FontAwesomeIcon
                            icon={faCrosshairs}
                            className="absolute w-3 h-3 -translate-x-1/2 text-red-500 -translate-y-1/2 cursor-grab active:cursor-grabbing pointer-events-auto"
                            onMouseDown={() => handleMouseDown(key)}
                        />
                        <div className="absolute left-4 -top-2 bg-black/50 px-2 py-1 rounded text-white text-xs whitespace-nowrap">
                            {`${Math.round(point.camera[0])}, ${Math.round(point.camera[1])}`}
                        </div>
                    </div>
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