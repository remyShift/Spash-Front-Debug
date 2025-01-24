import { JSONData } from "@/types/files";

export const drawCourt = (
    width: number,
    height: number,
    serviceLineHeight: number,
    middleLineHeight: number,
    context: CanvasRenderingContext2D
) => {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#FF0000';
    context.lineWidth = 2;
    context.strokeRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(width/2, serviceLineHeight);
    context.lineTo(width/2, height - serviceLineHeight);
    context.stroke();

    context.beginPath();
    context.moveTo(0, serviceLineHeight);
    context.lineTo(width, serviceLineHeight);
    context.moveTo(0, height - serviceLineHeight);
    context.lineTo(width, height - serviceLineHeight);
    context.stroke();

    context.strokeStyle = '#FFFFFF';
    context.beginPath();
    context.moveTo(0, middleLineHeight);
    context.lineTo(width, middleLineHeight);
    context.stroke();
}

export const drawPlayers = (
    frameData: JSONData['data'][number],
    width: number,
    height: number,
    context: CanvasRenderingContext2D
) => {
    if (!frameData?.persontracking) return;

    Object.entries(frameData.persontracking).forEach(([, player]) => {
        if (!player?.court_legs) return;

        const [x, y] = player.court_legs;
        const radarX = (x / 10) * width;
        const radarY = (y / 20) * height;

        context.fillStyle = player.name === 'A' || player.name === 'B' ? '#FF0000' : '#0000FF';
        context.beginPath();
        context.arc(radarX, radarY, 5, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = '#FFFFFF';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText(player.name, radarX, radarY - 10);
    });
}