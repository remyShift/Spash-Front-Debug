import { AllLayers, BallLayer } from "@/types/layers";
import { JSONData } from "@/types/files";
import { PersonTracking } from "@/types/files";
import { drawFootPlayerBBox } from "./players/drawFootBboxPlayer";
import { drawBall } from "@/utils/drawing/padel/ball/drawBall";
import { drawHomography } from "@/utils/drawing/drawHomography";

export function processFootMainLayer(
    layer: AllLayers,
    players: [string, PersonTracking][],
    frameData: JSONData['data'][number],
    videoWidth: number,
    videoHeight: number,
    mainCtx: CanvasRenderingContext2D,
    videoData: JSONData,
) {
    switch (layer) {
        case 'players':
            if (players) {
                players.forEach(([, player]) => {
                    drawFootPlayerBBox(player, videoWidth, videoHeight, mainCtx);
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
        case 'homography':
            if (videoData.zones.homography) {
                drawHomography(videoData.zones.homography, videoWidth, videoHeight, mainCtx);
            }
            break;
    }
}