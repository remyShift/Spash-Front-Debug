import { JSONData } from "@/types/files";

export const drawRadar = (
    frameData: JSONData['data'][number],
    width: number,
    height: number,
    context: CanvasRenderingContext2D
) => {
    if (!frameData?.persontracking) return;

    Object.values(frameData.persontracking).forEach((player) => {
        if (!player?.court_legs) return;

        const [x, y] = player.court_legs;
        const radarX = x / 10 * width;
        const radarY = y / 20 * height;

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