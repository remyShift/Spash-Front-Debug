import { defaultDrawingConfig } from "./config";
import { JSONData } from "@/types/files";
import { BallLayer, Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawFramesNumber } from "./drawFrames";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";
import { drawHits } from "./players/drawHits";
import { drawTeamDistances } from "./players/drawTeamDistances";
import { drawPlayerTrajectories } from "./players/drawPlayerTrajectories";
import { drawBallTrajectory } from "./ball/drawBallTrajectory";

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

    const players = frameData.persontracking ? Object.entries(frameData.persontracking) : [];

    activeLayers.forEach(layer => {
        if (layer === 'hits' && players.length) {
            players.forEach(([, player]) => {
                drawHits(player, currentFrame, videoWidth, videoHeight, persistentCtx);
            });
        } else if (layer === 'trajectories' && players.length) {
            if (frameData["ball.center.video"]) {
                const ball: BallLayer = {
                    coordinates: frameData["ball.center.video"],
                    score: frameData["ball.score"] || 0
                };
                drawBallTrajectory(ball, currentFrame, videoWidth, videoHeight, persistentCtx);
            }
            players.forEach(([, player]) => {
                drawPlayerTrajectories(player, currentFrame, videoWidth, videoHeight, persistentCtx);
            });
        } else {
            switch (layer) {
                case 'homography':
                    drawFramesNumber(currentFrame, mainCtx, Object.keys(videoData.data).length, defaultDrawingConfig);
                    break;
                case 'players':
                    if (players.length) {
                        players.forEach(([, player]) => {
                            drawPlayerBBox(player, videoWidth, videoHeight, mainCtx);
                        });
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
                    if (players.length) {
                        drawTeamDistances(players, videoWidth, videoHeight, mainCtx);
                    }
                    break;
            }
        }
    });
}