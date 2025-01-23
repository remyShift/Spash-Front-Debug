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
import { drawAreasAB, drawAreasCD } from "./areas/drawAreas";
import { PersonTracking } from "@/types/files";
import { drawHomography } from "./areas/drawHomography";
import { drawDivorceZones } from "./zones/drawDivorceZones";

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

    if (!frameData || !videoWidth || !videoHeight || !mainCtx || !persistentCtx) return;
    
    mainCtx.clearRect(0, 0, canvasRefs.mainCanvas.width, canvasRefs.mainCanvas.height);
    
    persistentCtx.clearRect(0, 0, canvasRefs.persistentCanvas.width, canvasRefs.persistentCanvas.height);

    [mainCtx, persistentCtx].forEach(ctx => {
        if (ctx) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.imageSmoothingEnabled = false;
        }
    });

    if (canvasRefs.mainCanvas.width !== videoWidth || canvasRefs.mainCanvas.height !== videoHeight) {
        [canvasRefs.mainCanvas, canvasRefs.persistentCanvas].forEach(canvas => {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
        });
    }

    const mainLayerOperations: Layers[] = ['players', 'ball', 'distance', 'rebounds', 'homography'];
    const persistentLayerOperations: Layers[] = ['hits', 'trajectories', 'areas-ab', 'areas-cd', 'divorces', 'top lob', 'safe ball'];

    const players = frameData.persontracking ? Object.entries(frameData.persontracking) : [];

    if (activeLayers.includes('areas-ab')) {
        processPersistentLayer('areas-ab', players, frameData, videoData, videoWidth, videoHeight, persistentCtx, currentFrame);
    }
    if (activeLayers.includes('areas-cd')) {
        processPersistentLayer('areas-cd', players, frameData, videoData, videoWidth, videoHeight, persistentCtx, currentFrame);
    }

    activeLayers.forEach(layer => {
        if (mainLayerOperations.includes(layer)) {
            processMainLayer(layer, players, frameData, videoWidth, videoHeight, mainCtx, videoData, currentFrame);
        } else if (persistentLayerOperations.includes(layer) && !['areas-ab', 'areas-cd'].includes(layer)) {
            processPersistentLayer(layer, players, frameData, videoData, videoWidth, videoHeight, persistentCtx, currentFrame);
        }
    });
}

function processMainLayer(
    layer: Layers,
    players: [string, PersonTracking][],
    frameData: JSONData['data'][number],
    videoWidth: number,
    videoHeight: number,
    mainCtx: CanvasRenderingContext2D,
    videoData: JSONData,
    currentFrame: number
) {
    switch (layer) {
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
        case 'homography':
            if (videoData.zones.homography) {
                drawHomography(videoData.zones.homography, videoWidth, videoHeight, mainCtx);
            }
            break;
    }
}

function processPersistentLayer(
    layer: Layers,
    players: [string, PersonTracking][],
    frameData: JSONData['data'][number],
    videoData: JSONData,
    videoWidth: number,
    videoHeight: number,
    persistentCtx: CanvasRenderingContext2D,
    currentFrame: number
) {
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
        case 'areas-ab':
            if (videoData.zones.homography) {
                const zonesAB = {
                    nomansland_left: videoData.zones.nomansland_left,
                    attack_left: videoData.zones.attack_left,
                    defense_left: videoData.zones.defense_left
                };
                drawAreasAB(players, currentFrame, videoWidth, videoHeight, persistentCtx, zonesAB);
            }
            break;
        case 'areas-cd':
            if (videoData.zones.homography) {
                const zonesCD = {
                    nomansland_right: videoData.zones.nomansland_right,
                    attack_right: videoData.zones.attack_right,
                    defense_right: videoData.zones.defense_right
                };
                drawAreasCD(players, currentFrame, videoWidth, videoHeight, persistentCtx, zonesCD);
            }
            break;
        case 'divorces':
            if (videoData.zones.divorce_right) {
                const divorceZones = {
                    divorce_right: videoData.zones.divorce_right
                };
                drawDivorceZones(players, currentFrame, videoWidth, videoHeight, persistentCtx, divorceZones);
            }
            break;
    }
}