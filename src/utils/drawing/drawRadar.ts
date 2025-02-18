import { JSONData } from "@/types/files";
import { getPlayerColor } from "@/utils/drawing/colors";
import { drawBounceOnRadar } from "./padel/radar/drawBounceOnRadar";
import { drawRadarDistance } from "./padel/radar/drawRadarDistance";

export const drawRadar = (
    frameData: JSONData['data'][number],
    currentFrame: number,
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    sport: string
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return; 

    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);

    if (sport === "padel") {
        drawBounceOnRadar(frameData, currentFrame, width, height, ctx);
        drawRadarDistance(frameData, width, height, ctx);
    }

    if (frameData.persontracking) {
        Object.entries(frameData.persontracking).forEach(([, player]) => {
            if (!player?.court_legs) return;
            
            const [x, y] = player.court_legs;
            
            let radarX, radarY;
            
            if (sport === "padel") {
                radarX = (-y) * (width/10);
                radarY = x * (height/20);
            } else {
                // Pour un terrain de football (25m x 15m)
                const fieldWidth = 15;
                const fieldHeight = 25;
                
                radarX = (-y) * (width/fieldWidth);
                radarY = x * (height/fieldHeight);
            }

            ctx.beginPath();
            ctx.arc(radarX + width/2, radarY + height/2, 6, 0, 2 * Math.PI);

            if (sport === "foot" && player.class) {
                ctx.fillStyle = player.class === 3  ? '#FF0000' : '#90EE90';
            } else if (player.id) {
                ctx.fillStyle = getPlayerColor(player.id);
            }
            
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            const displayText = sport === "foot" ? 
                `${player.id || ''}` : 
                (player.name || player.id.toString());
            ctx.fillText(displayText, radarX + width/2, radarY + height/2 - 10);
        });
    }
};