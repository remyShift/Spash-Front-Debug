import { configureContext } from "../../canvas";
import { PersonTracking } from "@/types/files";

interface TacticalZone {
    name: string;
    points: [number, number][];
    color: string;
}

export const drawAreasAB = (
    players: [string, PersonTracking][],
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        nomansland_left: [number, number][];
        attack_left: [number, number][];
        defense_left: [number, number][];
    }
) => {
    const canvas = context.canvas;
    configureContext(context);

    const zonesConfig: TacticalZone[] = [
        {
            name: "ATTAQUE",
            points: zones.attack_left,
            color: "rgba(255, 0, 0, 0.2)"
        },
        {
            name: "NO MANS LAND",
            points: zones.nomansland_left,
            color: "rgba(255, 255, 0, 0.2)"
        },
        {
            name: "DEFENSE",
            points: zones.defense_left,
            color: "rgba(0, 255, 0, 0.2)"
        }
    ];

    zonesConfig.forEach(zone => {
        if (zone.points.length === 0) return;

        const scaledPoints = zone.points.map(([x, y]): [number, number] => [
            (x / videoWidth) * canvas.width,
            (y / videoHeight) * canvas.height
        ]);

        context.beginPath();
        context.moveTo(scaledPoints[0][0], scaledPoints[0][1]);

        for (let i = 1; i < scaledPoints.length; i++) {
            context.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
        }

        context.lineTo(scaledPoints[0][0], scaledPoints[0][1]);
        context.closePath();

        const isPlayersInZone = players.filter(([, player]) => {
            const zoneName = zone.name.toLowerCase().replace(/\s+/g, '');
            return player.zones[zoneName as keyof typeof player.zones];
        });

        const teamA = isPlayersInZone.filter(([, player]) => ['A', 'B'].includes(player.name));

        const baseOpacity = Math.max(
            teamA.length > 1 ? 0.6 : teamA.length === 1 ? 0.4 : 0.2
        );

        context.fillStyle = zone.color.replace("0.2", baseOpacity.toString());
        context.shadowColor = zone.color.replace("0.2", "1");
        context.fill();

        context.shadowBlur = 0;
        context.strokeStyle = zone.color.replace("0.2", "0.8");
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;
        context.fillText(zone.name, centerX, centerY);
    });
};




export const drawAreasCD = (
    players: [string, PersonTracking][],
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        nomansland_right: [number, number][];
        attack_right: [number, number][];
        defense_right: [number, number][];
    }
) => {
    const canvas = context.canvas;
    configureContext(context);

    const zonesConfig: TacticalZone[] = [
        {
            name: "ATTAQUE",
            points: zones.attack_right,
            color: "rgba(255, 0, 0, 0.2)"
        },
        {
            name: "NO MANS LAND",
            points: zones.nomansland_right,
            color: "rgba(255, 255, 0, 0.2)"
        },
        {
            name: "DEFENSE",
            points: zones.defense_right,
            color: "rgba(0, 255, 0, 0.2)"
        }
    ];

    zonesConfig.forEach(zone => {
        if (zone.points.length === 0) return;

        const scaledPoints = zone.points.map(([x, y]): [number, number] => [
            (x / videoWidth) * canvas.width,
            (y / videoHeight) * canvas.height
        ]);

        context.beginPath();
        context.moveTo(scaledPoints[0][0], scaledPoints[0][1]);

        for (let i = 1; i < scaledPoints.length; i++) {
            context.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
        }

        context.lineTo(scaledPoints[0][0], scaledPoints[0][1]);
        context.closePath();

        const isPlayersInZone = players.filter(([, player]) => {
            const zoneName = zone.name.toLowerCase().replace(/\s+/g, '');
            return player.zones[zoneName as keyof typeof player.zones];
        });

        const teamC = isPlayersInZone.filter(([, player]) => ['C', 'D'].includes(player.name));

        const baseOpacity = Math.max(
            teamC.length > 1 ? 0.6 : teamC.length === 1 ? 0.4 : 0.2
        );

        context.fillStyle = zone.color.replace("0.2", baseOpacity.toString());
        context.shadowColor = zone.color.replace("0.2", "1");
        context.fill();

        context.shadowBlur = 0;
        context.strokeStyle = zone.color.replace("0.2", "0.8");
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        const centerX = scaledPoints.reduce((sum, [x]) => sum + x, 0) / scaledPoints.length;
        const centerY = scaledPoints.reduce((sum, [, y]) => sum + y, 0) / scaledPoints.length;
        context.fillText(zone.name, centerX, centerY);
    });
};