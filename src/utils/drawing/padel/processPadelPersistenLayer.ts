import { PadelLayers, FootballLayers } from "@/types/layers";
import { JSONData, PersonTracking } from "@/types/files";
import { BallLayer } from "@/types/layers";
import { drawHits } from "./players/drawHits";
import { drawBallTrajectory } from "./ball/drawBallTrajectory";
import { drawPlayerTrajectories } from "./players/drawPlayerTrajectories";
import { drawAreasAB, drawAreasCD } from "./areas/drawAreas";
import { drawDivorceZones } from "./zones/drawDivorceZones";
import { drawTopLobZones } from "./zones/drawTopLobZones";
import { drawSafeBallZones } from "./zones/drawSafeBallZones";

export function processPadelPersistentLayer(
    layer: PadelLayers | FootballLayers,
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
                drawAreasAB(players, videoWidth, videoHeight, persistentCtx, zonesAB);
            }
            break;
        case 'areas-cd':
            if (videoData.zones.homography) {
                const zonesCD = {
                    nomansland_right: videoData.zones.nomansland_right,
                    attack_right: videoData.zones.attack_right,
                    defense_right: videoData.zones.defense_right
                };
                drawAreasCD(players, videoWidth, videoHeight, persistentCtx, zonesCD);
            }
            break;
        case 'divorces':
            if (videoData.zones.divorce_right) {
                const divorceZones = {
                    divorce_right: videoData.zones.divorce_right,
                    divorce_left: videoData.zones.divorce_left
                };
                drawDivorceZones(currentFrame, videoWidth, videoHeight, persistentCtx, videoData, divorceZones);
            }
            break;
        case 'top lob':
            if (videoData.zones.toplob_right) {
                const topLobZones = {
                    top_lob_right: videoData.zones.toplob_right,
                    top_lob_left: videoData.zones.toplob_left
                };
                drawTopLobZones(currentFrame, videoWidth, videoHeight, persistentCtx, videoData, topLobZones);
            }
            break;
        case 'safe ball':
            if (videoData.zones.balle_sure_right) {
                const safeBallZones = {
                    balle_sure_right: videoData.zones.balle_sure_right,
                    balle_sure_left: videoData.zones.balle_sure_left
                };
                drawSafeBallZones(currentFrame, videoWidth, videoHeight, persistentCtx, videoData, safeBallZones);
            }
            break;
    }
}