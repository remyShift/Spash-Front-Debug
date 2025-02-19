import { JSONData } from "@/types/files";
import { FootballLayers } from "@/types/layers";
import { initializeAnimation } from "../config";
import { RenderTiming } from "@/types/performance";
import { measureRenderTime } from "@/utils/drawing/performance";
import { processFootMainLayer } from "./processFootMainLayer";

interface CanvasRefs {
    mainCanvas: HTMLCanvasElement;
    persistentCanvas?: HTMLCanvasElement;
}

interface DrawOptions {
    onTimingsUpdate?: (main: RenderTiming, persistent: RenderTiming) => void;
}

export const drawFootElements = (
    videoData: JSONData, 
    activeLayers: FootballLayers[], 
    videoRef: HTMLVideoElement,
    canvasRefs: CanvasRefs,
    options?: DrawOptions
) => {
    const mainMeasure = measureRenderTime('main');
    const persistentMeasure = measureRenderTime('persistent');
    
    const { videoWidth, videoHeight, frameData } = initializeAnimation(videoRef, videoData);
    const mainCtx = canvasRefs.mainCanvas.getContext('2d');

    if (!frameData || !videoWidth || !videoHeight || !mainCtx) return;

    if (canvasRefs.mainCanvas.width !== videoWidth || canvasRefs.mainCanvas.height !== videoHeight) {
        canvasRefs.mainCanvas.width = videoWidth;
        canvasRefs.mainCanvas.height = videoHeight;
    }

    mainCtx.clearRect(0, 0, canvasRefs.mainCanvas.width, canvasRefs.mainCanvas.height);
    
    const players = frameData.persontracking ? Object.entries(frameData.persontracking) : [];

    activeLayers.forEach(layer => {
        const footballLayer = layer as FootballLayers;
        if (['players', 'ball', 'homography', 'cover-areas', 'zones', 'corridors'].includes(footballLayer)) {
            processFootMainLayer(footballLayer, players, frameData, videoWidth, videoHeight, mainCtx, videoData);
        }
    });

    const persistentTiming = persistentMeasure();
    const mainTiming = mainMeasure();

    options?.onTimingsUpdate?.(mainTiming, persistentTiming);
}