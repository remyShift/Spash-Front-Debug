import { defaultDrawingConfig } from "./config";
import { JSONData } from "@/types/files";
import { Layers } from "@/types/layers";
import { initializeAnimation } from "./config";
import { drawFramesNumber } from "./drawFrames";
import { drawPlayerBBox } from "./players/drawBboxPlayer";
import { drawBall } from "./ball/drawBall";

export const drawElements = (
    videoData: JSONData, 
    activeLayers: Layers[], 
    videoRef: HTMLVideoElement,
    canvasRef: HTMLCanvasElement,
    setCurrentFrame: (frame: number) => void
) => {
    const { videoWidth, videoHeight, frameData, currentFrame } = initializeAnimation(videoRef, videoData);
    setCurrentFrame(currentFrame);

    if (canvasRef) {
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;

        if (!frameData || !videoWidth || !videoHeight || activeLayers.length === 0) {
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        } else {
            canvasRef.width = videoWidth;
            canvasRef.height = videoHeight;

            activeLayers.forEach(layer => {
                drawFramesNumber(currentFrame, ctx, Object.keys(videoData.data).length, defaultDrawingConfig);
                switch (layer) {
                    case 'homography':
                        console.log(frameData);
                        break;
                    case 'players':
                        if (!frameData.persontracking) return;
                        Object.values(frameData.persontracking).forEach(player => {
                            drawPlayerBBox(player, videoWidth, videoHeight, ctx);
                        });
                        break;
                    case 'ball':
                        if (!frameData["ball.center.video"]) return;
                        drawBall(frameData["ball.center.video"], videoWidth, videoHeight, ctx);
                        break;
                    // case 'zones':
                    //     drawZones(frameData.zones, videoWidth, videoHeight, ctx);
                    //     break;
                }
            });
        }
    }
}