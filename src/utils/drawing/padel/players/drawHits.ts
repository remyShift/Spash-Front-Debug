import { PersonTracking } from "@/types/files";
import { isValidBBox } from "../../boundingBox";
import { configureContext } from "../../canvas";

const GLOW_DURATION = 10;
const GLOW_INTENSITY = 15;
const MAX_ACTIVE_HITS = 1;

interface ActiveHit {
    startFrame: number;
    endFrame: number;
    playerId: number;
}

const activeHits: ActiveHit[] = [];

export const drawHits = (player: PersonTracking, currentFrame: number, videoWidth: number, videoHeight: number, ctx: CanvasRenderingContext2D) => {
    const expiredIndex = activeHits.findIndex(hit => hit.endFrame < currentFrame);
    if (expiredIndex !== -1) {
        activeHits.splice(expiredIndex, 1);
    }

    if (player.do_hit) {
        if (activeHits.length >= MAX_ACTIVE_HITS) {
            activeHits.shift();
        }

        const existingHit = activeHits.find(hit => 
            hit.playerId === player.id && 
            hit.startFrame + GLOW_DURATION > currentFrame
        );

        if (!existingHit) {
            activeHits.push({
                startFrame: currentFrame,
                endFrame: currentFrame + GLOW_DURATION,
                playerId: player.id ?? 0
            });
        }
    }
    
    const activeHit = activeHits.find(hit => hit.playerId === player.id);
    if (!activeHit) return;

    const canvas = ctx.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x1, y1, x2, y2] = player.bbox;
    if (!isValidBBox(x1, y1, x2, y2, videoWidth, videoHeight)) return;

    const [, legsY] = player.legs;

    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledLegsY = legsY * scaleY;

    const boxWidth = Math.abs(scaledX2 - scaledX1);
    const boxHeight = Math.abs(scaledLegsY - scaledY1);

    const timeUntilEnd = activeHit.endFrame - currentFrame;
    const fadeOutDuration = 5;
    
    let alpha = 1;
    if (timeUntilEnd < fadeOutDuration) {
        alpha = timeUntilEnd / fadeOutDuration;
    }
    
    alpha = Math.max(0.3, alpha);
    
    ctx.save();
    
    const shadowColor = '#FF5F49';
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = GLOW_INTENSITY * alpha;
    ctx.strokeStyle = `${shadowColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 4;
    
    configureContext(ctx, { strokeStyle: ctx.strokeStyle, lineWidth: ctx.lineWidth });
    
    for (let i = 0; i < 3; i++) {
        ctx.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);
    }

    ctx.restore();
}