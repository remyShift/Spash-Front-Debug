import { defaultDrawingConfig } from "./config";
import { JSONData } from "@/types/files";
import { BallLayer, Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawFramesNumber } from "./drawFrames";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";
import { drawPlayerDistance } from "./players/drawPlayerDistance";
import { PersonTracking } from "@/types/files";
import { drawHits } from "./players/drawHits";
import { drawTeamDistances } from "./players/drawTeamDistances";

interface CanvasRefs {
    mainCanvas: HTMLCanvasElement;
    persistentCanvas: HTMLCanvasElement;
}

export const drawElements = (
    videoData: JSONData, 
    activeLayers: Layers[], 
    videoRef: HTMLVideoElement,
    canvasRefs: CanvasRefs,
) => {
    const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef, videoData);
    const mainCtx = canvasRefs.mainCanvas.getContext('2d');
    const persistentCtx = canvasRefs.persistentCanvas.getContext('2d');

    if (!mainCtx || !persistentCtx) return;

    mainCtx.clearRect(0, 0, canvasRefs.mainCanvas.width, canvasRefs.mainCanvas.height);
    persistentCtx.clearRect(0, 0, canvasRefs.persistentCanvas.width, canvasRefs.persistentCanvas.height);

    if (!frameData || !videoWidth || !videoHeight || activeLayers.length === 0) {
        return;
    }

    canvasRefs.mainCanvas.width = videoWidth;
    canvasRefs.mainCanvas.height = videoHeight;
    canvasRefs.persistentCanvas.width = videoWidth;
    canvasRefs.persistentCanvas.height = videoHeight;

    activeLayers.forEach(layer => {
        if (layer === 'hits' && frameData.persontracking) {
            Object.values(frameData.persontracking).forEach(player => {
                drawHits(player, currentFrame, videoWidth, videoHeight, persistentCtx);
            });
        } else {
            switch (layer) {
                case 'homography':
                    drawFramesNumber(currentFrame, mainCtx, Object.keys(videoData.data).length, defaultDrawingConfig);
                    break;
                case 'players':
                    if (!frameData.persontracking) return;
                    const players = Object.entries(frameData.persontracking);
                    
                    players.forEach(([, player]) => {
                        drawPlayerBBox(player, videoWidth, videoHeight, mainCtx);
                    });
                    
                    const playersByName = players.reduce((acc, [, player]) => {
                        if (player.name) {
                            acc[player.name] = player;
                        }
                        return acc;
                    }, {} as Record<string, PersonTracking>);

                    if (playersByName['A'] && playersByName['B']) {
                        drawPlayerDistance(
                            playersByName['A'],
                            playersByName['B'],
                            videoWidth,
                            videoHeight,
                            mainCtx
                        );
                    }

                    if (playersByName['C'] && playersByName['D']) {
                        drawPlayerDistance(
                            playersByName['C'],
                            playersByName['D'],
                            videoWidth,
                            videoHeight,
                            mainCtx
                        );
                    }
                    break;
                case 'ball':
                    if (!frameData["ball.center.video"]) return;
                    const ball: BallLayer = {
                        coordinates: frameData["ball.center.video"],
                        score: frameData["ball.score"] || 0
                    };
                    drawBall(ball, videoWidth, videoHeight, mainCtx);
                    break;
                case 'distance':
                    if (!frameData.persontracking) return;
                    drawTeamDistances(Object.entries(frameData.persontracking), videoWidth, videoHeight, mainCtx);
                    break;
            }
        }
    });
}