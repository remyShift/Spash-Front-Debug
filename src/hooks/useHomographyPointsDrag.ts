import { useState, useCallback } from 'react';

type HomographyPoints = { [key: string]: { camera: number[] } };

export const useHomographyPointsDrag = (
    setHomographyPoints: (points: HomographyPoints) => void
) => {
    const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointSelect = useCallback((pointKey: string) => {
        setSelectedPoint(pointKey);
        setIsDragging(true);
    }, []);

    const handlePointMove = useCallback((pointKey: string, x: number, y: number) => {
        if (isDragging && selectedPoint === pointKey) {
            const newPoints: HomographyPoints = { [pointKey]: { camera: [x, y] } };
            setHomographyPoints(newPoints);
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