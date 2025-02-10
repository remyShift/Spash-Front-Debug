import { HomographyPoint } from '@/types/files';
import { useState, useCallback } from 'react';

export const useHomographyPointsDrag = (
    setHomographyPoints: (points: HomographyPoint[]) => void
) => {
    const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointSelect = useCallback((pointKey: string) => {
        setSelectedPoint(pointKey);
        setIsDragging(true);
    }, []);

    const handlePointMove = useCallback((pointKey: string, x: number, y: number) => {
        if (isDragging && selectedPoint === pointKey) {
            const newPoints = { 
                [pointKey]: { 
                    name: pointKey,
                    camera: [x, y] as [number, number],
                } 
            };
            setHomographyPoints(Object.values(newPoints));
        }
    }, [isDragging, selectedPoint, setHomographyPoints]);

    const handlePointRelease = useCallback(() => {
        setSelectedPoint(null);
        setIsDragging(false);
    }, []);

    return {
        selectedPoint,
        isDragging,
        handlePointSelect,
        handlePointMove,
        handlePointRelease
    };
}; 