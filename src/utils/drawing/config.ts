import { DrawingConfig } from '@/types/draw';
import { JSONData } from '@/types/files';

export const defaultDrawingConfig: DrawingConfig = {
    strokeStyle: '#FF0000',
    lineWidth: 2,
    font: 'bold 14px Arial'
};

export const initializeAnimation = (video: HTMLVideoElement, jsonData: JSONData) => {
    const fps = 25;
    const currentFrame = Math.round(video.currentTime * fps);
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const frameData = jsonData?.data[currentFrame];

    return {
        videoWidth,
        videoHeight,
        frameData,
        currentFrame
    };
};