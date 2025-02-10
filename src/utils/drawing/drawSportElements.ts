import { PadelLayers, FootballLayers } from "@/types/layers";
import { JSONData } from "@/types/files";
import { drawPadelElements } from "./padel/drawPadelElements";
import { drawFootElements } from "./foot/drawFootElements";
import { RenderTiming } from "@/types/performance";

interface CanvasRefs {
    mainCanvas: HTMLCanvasElement;
    persistentCanvas?: HTMLCanvasElement;
}

interface DrawOptions {
    onTimingsUpdate?: (main: RenderTiming, persistent: RenderTiming) => void;
}

export const drawSportElements = (
    sport: 'padel' | 'foot',
    videoData: JSONData,
    activeLayers: PadelLayers[] | FootballLayers[],
    videoRef: HTMLVideoElement,
    canvasRefs: CanvasRefs,
    options?: DrawOptions
) => {
    if (sport === 'padel') {
        const typedActiveLayers = activeLayers as PadelLayers[];
        drawPadelElements(videoData, typedActiveLayers, videoRef, canvasRefs);
    } else if (sport === 'foot') {
        const typedActiveLayers = activeLayers as FootballLayers[];
        drawFootElements(videoData, typedActiveLayers, videoRef, canvasRefs, options);
    }
}