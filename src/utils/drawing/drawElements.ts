import { JSONData } from "@/types/files";
import { BallLayer, PadelLayers, FootballLayers, AllLayers } from "@/types/layers";
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
import { drawSafeBallZones } from "./zones/drawSafeBallZones";
import { drawTopLobZones } from "./zones/drawTopLobZones";
import { RenderTiming } from "@/types/performance";
import { measureRenderTime } from "@/utils/drawing/performance";
import { drawCumulativeDistances } from "./players/drawCumulativeDistances";

interface CanvasRefs {
    mainCanvas: HTMLCanvasElement;
    persistentCanvas: HTMLCanvasElement;
}

interface DrawOptions {
    onTimingsUpdate?: (main: RenderTiming, persistent: RenderTiming) => void;
}

export const drawElements = (
    videoData: JSONData, 
    activeLayers: PadelLayers[] | FootballLayers[], 
    videoRef: HTMLVideoElement,
    canvasRefs: CanvasRefs,
    options?: DrawOptions
) => {
    const mainMeasure = measureRenderTime('main');
    const persistentMeasure = measureRenderTime('persistent');
    
    const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef, videoData);
    const mainCtx = canvasRefs.mainCanvas.getContext('2d');
    const persistentCtx = canvasRefs.persistentCanvas.getContext('2d');

    if (!frameData || !videoWidth || !videoHeight || !mainCtx || !persistentCtx) return;

    if (canvasRefs.mainCanvas.width !== videoWidth || canvasRefs.mainCanvas.height !== videoHeight) {
        [canvasRefs.mainCanvas, canvasRefs.persistentCanvas].forEach(canvas => {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
        });
    }

    persistentCtx.clearRect(0, 0, canvasRefs.persistentCanvas.width, canvasRefs.persistentCanvas.height);
    mainCtx.clearRect(0, 0, canvasRefs.mainCanvas.width, canvasRefs.mainCanvas.height);
    
    const players = frameData.persontracking ? Object.entries(frameData.persontracking) : [];
    const sport = videoData.info.cfg.sport;

    if (sport === 'padel') {
        activeLayers.forEach(layer => {
            const padelLayer = layer as PadelLayers;
            if (['areas-ab', 'areas-cd', 'hits', 'trajectories', 'divorces', 'top lob', 'safe ball'].includes(padelLayer)) {
                processPersistentLayer(padelLayer, players, frameData, videoData, videoWidth, videoHeight, persistentCtx, currentFrame);
            }
            if (['players', 'ball', 'distance', 'rebounds', 'homography', 'cumulative distances'].includes(padelLayer)) {
                processMainLayer(padelLayer, players, frameData, videoWidth, videoHeight, mainCtx, videoData, currentFrame);
            }
        });
    } else if (sport === 'foot') {
        activeLayers.forEach(layer => {
            const footballLayer = layer as FootballLayers;
            if (['players', 'ball'].includes(footballLayer)) {
                processMainLayer(footballLayer, players, frameData, videoWidth, videoHeight, mainCtx, videoData, currentFrame);
            }
        });
    }

    const persistentTiming = persistentMeasure();
    const mainTiming = mainMeasure();

    options?.onTimingsUpdate?.(mainTiming, persistentTiming);
}

function processMainLayer(
    layer: AllLayers,
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
        case 'cumulative distances':
            if (players) {
                drawCumulativeDistances(players, videoWidth, videoHeight, mainCtx);
            }
            break;
    }
}

function processPersistentLayer(
    layer: AllLayers,
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
                    divorce_right: videoData.zones.divorce_right,
                    divorce_left: videoData.zones.divorce_left
                };
                drawDivorceZones(players, currentFrame, videoWidth, videoHeight, persistentCtx, videoData, divorceZones);
            }
            break;
        case 'top lob':
            if (videoData.zones.toplob_right) {
                const topLobZones = {
                    top_lob_right: videoData.zones.toplob_right,
                    top_lob_left: videoData.zones.toplob_left
                };
                drawTopLobZones(players, currentFrame, videoWidth, videoHeight, persistentCtx, videoData, topLobZones);
            }
            break;
        case 'safe ball':
            if (videoData.zones.balle_sure_right) {
                const safeBallZones = {
                    balle_sure_right: videoData.zones.balle_sure_right,
                    balle_sure_left: videoData.zones.balle_sure_left
                };
                drawSafeBallZones(players, currentFrame, videoWidth, videoHeight, persistentCtx, videoData, safeBallZones);
            }
            break;
    }
}