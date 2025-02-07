import { AllLayers, BallLayer } from "@/types/layers";
import { JSONData } from "@/types/files";
import { PersonTracking } from "@/types/files";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";
import { drawTeamDistances } from "./players/drawTeamDistances";
import { getNextReboundFrame } from "../../getNextReboundFrame";
import { drawBounceGlow } from "./ball/drawBounces";
import { drawNextReboundPrediction } from "./ball/drawNextReboundPrediction";
import { drawHomography } from "../drawHomography";
import { drawCumulativeDistances } from "./players/drawCumulativeDistances";


export function processPadelMainLayer(
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