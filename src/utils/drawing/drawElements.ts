import { defaultDrawingConfig } from "./config";
import { JSONData } from "@/types/files";
import { BallLayer, Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawFramesNumber } from "./drawFrames";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";

export const drawElements = (
    videoData: JSONData, 
    activeLayers: Layers[], 
    videoRef: HTMLVideoElement,
    canvasRef: HTMLCanvasElement,
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
                        Object.values(frameData.persontracking).forEach(player => {
                            drawPlayerBBox(player, videoWidth, videoHeight, ctx);
                        });
                        break;
                    case 'ball':
                        if (!frameData["ball.center.video"]) return;
                        const ball: BallLayer = {
                            coordinates: frameData["ball.center.video"],
                            score: frameData["ball.score"] || 0
                        };
                        drawBall(ball, videoWidth, videoHeight, ctx);
                        break;
                    // case 'zones':
                    //     drawZones(frameData.zones, videoWidth, videoHeight, ctx);
                    //     break;
                }
            });
        }
    }
}