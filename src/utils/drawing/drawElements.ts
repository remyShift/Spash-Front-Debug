import { JSONData } from "@/types/files";
import { BallLayer, Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";
import { drawHits } from "./players/drawHits";
import { drawTeamDistances } from "./players/drawTeamDistances";
import { drawPlayerTrajectories } from "./players/drawPlayerTrajectories";
import { drawBallTrajectory } from "./ball/drawBallTrajectory";
import { drawBounceGlow } from "./ball/drawBounces";
import { getNextReboundFrame } from "@/utils/getNextReboundFrame";
import { drawNextReboundPrediction } from "@/utils/drawing/ball/drawNextReboundPrediction";
import { drawAreas } from "./areas/drawAreas";

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
        switch (layer) {
            case 'hits':
                if (players) {
                    players.forEach(([, player]) => {
                        drawHits(player, currentFrame, videoWidth, videoHeight, persistentCtx);
                    });
                }
                break;
            case 'trajectories':
                if (players) {
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
                }
                break;
            case 'players':
                if (players) {
                    players.forEach(([, player]) => {
                        drawPlayerBBox(player, videoWidth, videoHeight, mainCtx);
                    });
                }
                break;
            case 'ball':
                if (!frameData["ball.center.video"]) return;
                const ball: BallLayer = {
                    coordinates: frameData["ball.center.video"],
                    speed: frameData.speed || 0,
                    score: frameData["ball.score"] || 0
                };
                drawBall(ball, videoWidth, videoHeight, mainCtx);
                break;
            case 'distance':
                if (players) {
                    drawTeamDistances(players, videoWidth, videoHeight, mainCtx);
                }
                break;
            case 'rebounds':
                if (frameData["ball.center.video"]) {
                    const nextReboundFrame = getNextReboundFrame(videoData.data, currentFrame);
                    const ball: BallLayer = {
                        coordinates: frameData["ball.center.video"],
                        score: frameData["ball.score"] || 0,
                        rebound: frameData.detection === "Rebound",
                        nextReboundFrame: nextReboundFrame || undefined
                    };
                    drawBounceGlow(ball, currentFrame, videoWidth, videoHeight, mainCtx);
                    if (ball.nextReboundFrame) {
                        const nextReboundFrameCoordinates = videoData.data[ball.nextReboundFrame]["ball.center.video"] || [0, 0];
                        drawNextReboundPrediction(nextReboundFrameCoordinates, videoWidth, videoHeight, mainCtx);
                    }
                }
                break;
            case 'areas':
                if (players) {
                    drawAreas(players, currentFrame, videoWidth, videoHeight, persistentCtx);
                }
                break;
        }
    });
}