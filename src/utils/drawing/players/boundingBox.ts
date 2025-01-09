import { BoundingBoxDimensions } from '@/types/draw';

export const calculateBoundedDimensions = (
    dimensions: BoundingBoxDimensions,
    videoWidth: number,
    videoHeight: number
): BoundingBoxDimensions => {
    const maxWidth = videoWidth - dimensions.width;
    const maxHeight = videoHeight - dimensions.height;
    
    return {
        x: Math.min(Math.max(0, dimensions.x), maxWidth),
        y: Math.min(Math.max(0, dimensions.y), maxHeight),
        width: dimensions.width,
        height: dimensions.height
    };
};

export const isValidBBox = (
    x: number,
    y: number,
    width: number,
    height: number,
    videoWidth: number,
    videoHeight: number
): boolean => {
    return !(x < 0 || y < 0 || width > videoWidth || height > videoHeight);
};