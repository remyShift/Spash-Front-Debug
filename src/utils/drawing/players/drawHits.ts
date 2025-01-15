import { PersonTracking } from "@/types/files";
import { isValidBBox } from "./boundingBox";

const GLOW_DURATION = 75;
const GLOW_INTENSITY = 15;
const MAX_ACTIVE_HITS = 2;

interface ActiveHit {
    startFrame: number;
    endFrame: number;
    player: PersonTracking;
}

const activeHits: ActiveHit[] = [];

export const drawHits = (player: PersonTracking, currentFrame: number, videoWidth: number, videoHeight: number, ctx: CanvasRenderingContext2D) => {
    const currentIndex = activeHits.findIndex(hit => hit.endFrame < currentFrame);
    if (currentIndex !== -1) {
        activeHits.splice(currentIndex, 1);
    }

    if (activeHits.length >= MAX_ACTIVE_HITS) {
        activeHits.shift();
    }

    activeHits.push({
        startFrame: currentFrame,
        endFrame: currentFrame + GLOW_DURATION,
        player: { ...player }
    });

    activeHits.forEach((hit) => {
        const canvas = ctx.canvas;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        const [x1, y1, x2, y2] = hit.player.bbox;
        if (!isValidBBox(x1, y1, x2, y2, videoWidth, videoHeight)) return;

        const [, legsY] = hit.player.legs;

        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledX2 = x2 * scaleX;
        const scaledLegsY = legsY * scaleY;

        const boxWidth = Math.abs(scaledX2 - scaledX1);
        const boxHeight = Math.abs(scaledLegsY - scaledY1);

        const fadeProgress = Math.max(0, 1 - ((currentFrame - hit.startFrame) / GLOW_DURATION));
        const alpha = Math.max(0.3, fadeProgress);
        
        ctx.save();
        
        const shadowColor = '#FF5F49';
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = GLOW_INTENSITY * fadeProgress;
        ctx.strokeStyle = `${shadowColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 3; i++) {
            ctx.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);
        }

        ctx.restore();
    });
}