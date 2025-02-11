import { PersonTracking } from "@/types/files";

export const drawRadarDistance = (
    frameData: { persontracking?: Record<string, PersonTracking> },
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
) => {
    if (!frameData?.persontracking) return;

    const playersByName = Object.values(frameData.persontracking).reduce((acc, player) => {
        if (player.name) {
            acc[player.name] = player;
        }
        return acc;
    }, {} as Record<string, PersonTracking>);

    const drawTeamDistance = (player1: PersonTracking, player2: PersonTracking) => {
        if (!player1?.court_legs || !player2?.court_legs) return;

        const [x1, y1] = player1.court_legs;
        const [x2, y2] = player2.court_legs;

        const radarX1 = (-y1) * (width/10) + width/2;
        const radarY1 = x1 * (height/20) + height/2;
        const radarX2 = (-y2) * (width/10) + width/2;
        const radarY2 = x2 * (height/20) + height/2;

        const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
        ).toFixed(2);

        ctx.beginPath();
        ctx.moveTo(radarX1, radarY1);
        ctx.lineTo(radarX2, radarY2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        const centerX = (radarX1 + radarX2) / 2;
        const centerY = (radarY1 + radarY2) / 2;

        ctx.font = '12px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(`${distance}m`, centerX, centerY - 5);
    };

    if (playersByName['A'] && playersByName['B']) {
        drawTeamDistance(playersByName['A'], playersByName['B']);
    }

    if (playersByName['C'] && playersByName['D']) {
        drawTeamDistance(playersByName['C'], playersByName['D']);
    }
}; 