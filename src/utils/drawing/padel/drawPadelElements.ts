import { JSONData } from "@/types/files";
import { PadelLayers } from "@/types/layers";
import { initializeAnimation } from "../config";
import { RenderTiming } from "@/types/performance";
import { measureRenderTime } from "@/utils/drawing/performance";
import { processPadelMainLayer } from "./processPadelMainLayer";
import { processPadelPersistentLayer } from "./processPadelPersistenLayer";

interface CanvasRefs {
    mainCanvas: HTMLCanvasElement;
    persistentCanvas?: HTMLCanvasElement;
}

interface DrawOptions {
    onTimingsUpdate?: (main: RenderTiming, persistent: RenderTiming) => void;
}

export const drawPadelElements = (
    videoData: JSONData, 
    activeLayers: PadelLayers[], 
    videoRef: HTMLVideoElement,
    canvasRefs: CanvasRefs,
    options?: DrawOptions
) => {
    const mainMeasure = measureRenderTime('main');
    const persistentMeasure = measureRenderTime('persistent');
    
    const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef, videoData);
    const mainCtx = canvasRefs.mainCanvas.getContext('2d');
    const persistentCtx = canvasRefs.persistentCanvas?.getContext('2d');

    if (!frameData || !videoWidth || !videoHeight || !mainCtx || !persistentCtx) return;

    if (canvasRefs.mainCanvas.width !== videoWidth || canvasRefs.mainCanvas.height !== videoHeight) {
        canvasRefs.mainCanvas.width = videoWidth;
        canvasRefs.mainCanvas.height = videoHeight;
        if (canvasRefs.persistentCanvas) {
            canvasRefs.persistentCanvas.width = videoWidth;
            canvasRefs.persistentCanvas.height = videoHeight;
        }
    }

    persistentCtx?.clearRect(0, 0, canvasRefs.persistentCanvas?.width ?? 0, canvasRefs.persistentCanvas?.height ?? 0);
    mainCtx.clearRect(0, 0, canvasRefs.mainCanvas.width, canvasRefs.mainCanvas.height);
    
    const players = frameData.persontracking ? Object.entries(frameData.persontracking) : [];

    activeLayers.forEach(layer => {
        const padelLayer = layer as PadelLayers;
        if (['areas-ab', 'areas-cd', 'hits', 'trajectories', 'divorces', 'top lob', 'safe ball'].includes(padelLayer)) {
            processPadelPersistentLayer(padelLayer, players, frameData, videoData, videoWidth, videoHeight, persistentCtx, currentFrame);
        }
        if (['players', 'ball', 'distance', 'rebounds', 'homography', 'cumulative distances'].includes(padelLayer)) {
            processPadelMainLayer(padelLayer, players, frameData, videoWidth, videoHeight, mainCtx, videoData, currentFrame);
        }
    });

    const persistentTiming = persistentMeasure();
    const mainTiming = mainMeasure();

    options?.onTimingsUpdate?.(mainTiming, persistentTiming);
}