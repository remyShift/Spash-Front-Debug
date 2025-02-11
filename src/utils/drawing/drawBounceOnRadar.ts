import { JSONData } from "@/types/files";

interface BouncePoint {
    x: number;
    y: number;
    frame: number;
}

const bouncePoints: BouncePoint[] = [];
const BOUNCE_DURATION = 20;
const FADE_OUT_DURATION = 5;

export const drawBounceOnRadar = (
    frameData: JSONData['data'][number],
    currentFrame: number,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
) => {
    if (frameData?.detection === "Rebound" && frameData["ball.court"]) {
        const [x, y] = frameData["ball.court"];
        
        const radarX = (-y) * (width/10);
        const radarY = x * (height/20);
        
        bouncePoints.push({
            x: radarX + width/2,
            y: radarY + height/2,
            frame: currentFrame
        });
    }
    
    while (bouncePoints.length > 0 && currentFrame - bouncePoints[0].frame > BOUNCE_DURATION) {
        bouncePoints.shift();
    }
    
    bouncePoints.forEach(point => {
        const timeRemaining = BOUNCE_DURATION - (currentFrame - point.frame);
        let opacity = 1;
        
        if (timeRemaining <= FADE_OUT_DURATION) {
            opacity = timeRemaining / FADE_OUT_DURATION;
        }
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
        ctx.fill();
        ctx.closePath();
    });
} 