import { AllLayers, BallLayer } from "@/types/layers";
import { JSONData } from "@/types/files";
import { PersonTracking } from "@/types/files";
import { drawFootPlayerBBox } from "./players/drawFootBboxPlayer";
import { drawBall } from "@/utils/drawing/drawBall";
import { drawHomography } from "@/utils/drawing/drawHomography";
import { drawCoverAreas } from "./zones/drawCoverAreas";
import { drawZones } from "./zones/drawZones";
import { drawCorridors } from "./zones/drawCorridors";

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
            drawBall(ball, videoWidth, videoHeight, mainCtx, videoData.info.cfg.sport);
            break;
        case 'homography':
            if (videoData.zones.homography) {
                drawHomography(videoData.zones.homography, videoWidth, videoHeight, mainCtx);
            }
            break;
        case 'cover-areas':
            drawCoverAreas(videoWidth, videoHeight, mainCtx, videoData.zones);
            break;
        case 'zones':
            drawZones(videoWidth, videoHeight, mainCtx, videoData.zones);
            break;
        case 'corridors':
            drawCorridors(videoWidth, videoHeight, mainCtx, videoData.zones);
            break;
    }
}