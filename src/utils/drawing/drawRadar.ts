import { JSONData } from "@/types/files";
import { getPlayerColor } from "@/utils/drawing/colors";

export const drawRadar = (
    framesData: JSONData['data'],
    currentFrame: number,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    
    const frameData = framesData[currentFrame];
    ctx.clearRect(0, 0, width, height);
    
    if (!frameData?.persontracking) return;
    
    Object.entries(frameData.persontracking).forEach(([, player]) => {
        if (!player?.court_legs) return;
        
        const [x, y] = player.court_legs;
        
        const radarX = (-y) * (width/10);
        const radarY = x * (height/20);

        ctx.beginPath();
        ctx.arc(radarX + width/2, radarY + height/2, 5, 0, 2 * Math.PI);
        if (player.id) {
            ctx.fillStyle = getPlayerColor(player.id);
            ctx.fill();
        }
        ctx.closePath();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name || player.id?.toString() || '', radarX + width/2, radarY + height/2 - 10);
    });
}; 