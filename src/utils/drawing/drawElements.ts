import { defaultDrawingConfig } from "./config";
import { JSONData } from "@/types/files";
import { BallLayer, HitsLayer, Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawFramesNumber } from "./drawFrames";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";
import { drawPlayerDistance } from "./players/drawPlayerDistance";
import { PersonTracking } from "@/types/files";
import { drawHits } from "./players/drawHits";

export const drawElements = (
    videoData: JSONData, 
    activeLayers: Layers[], 
    videoRef: HTMLVideoElement,
    canvasRef: HTMLCanvasElement,
    playersHits: HitsLayer
) => {
    const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef, videoData);

    if (canvasRef) {
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;

        if (!frameData || !videoWidth || !videoHeight || activeLayers.length === 0) {
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        } else {
            canvasRef.width = videoWidth;
            canvasRef.height = videoHeight;

            activeLayers.forEach(layer => {
                switch (layer) {
                    case 'homography':
                        drawFramesNumber(currentFrame, ctx, Object.keys(videoData.data).length, defaultDrawingConfig);
                        break;
                    case 'players':
                        if (!frameData.persontracking) return;
                        const players = Object.entries(frameData.persontracking);
                        
                        players.forEach(([, player]) => {
                            drawPlayerBBox(player, videoWidth, videoHeight, ctx);
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
                                ctx
                            );
                        }

                        if (playersByName['C'] && playersByName['D']) {
                            drawPlayerDistance(
                                playersByName['C'],
                                playersByName['D'],
                                videoWidth,
                                videoHeight,
                                ctx
                            );
                        }
                        break;
                    case 'ball':
                        if (!frameData["ball.center.video"]) return;
                        const ball: BallLayer = {
                            coordinates: frameData["ball.center.video"],
                            score: frameData["ball.score"] || 0
                        };
                        drawBall(ball, videoWidth, videoHeight, ctx);
                        break;
                    case 'hits':
                        if (!frameData.detection) return;
                        if (!frameData.persontracking) return;
                        
                        if (frameData.detection.toLowerCase() === 'hit') {
                            const players = Object.entries(frameData.persontracking);

                            players.forEach(([, player]) => {
                                const currentPlayerHit = playersHits[player.id];
                                if (currentPlayerHit.hits.includes(currentFrame)) {
                                    drawHits(player, currentFrame, videoWidth, videoHeight, ctx);
                                }
                            });
                        }
                        break;
                    // case 'zones':
                    //     drawZones(frameData.zones, videoWidth, videoHeight, ctx);
                    //     break;
                }
            });
        }
    }
}