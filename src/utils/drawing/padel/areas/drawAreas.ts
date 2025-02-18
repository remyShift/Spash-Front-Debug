import { configureContext } from "../../canvas";
import { PersonTracking } from "@/types/files";
import { drawZonePolygon } from "@/utils/drawing/drawZonePolygon";

interface TacticalZone {
    name: string;
    points: [number, number][];
    color: string;
}

export const drawAreasAB = (
    players: [string, PersonTracking][],
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        nomansland_left: [number, number][];
        attack_left: [number, number][];
        defense_left: [number, number][];
    }
) => {
    if (!context || !(context instanceof CanvasRenderingContext2D)) {
        console.error('Contexte de canvas invalide');
        return;
    }

    const canvas = context.canvas;
    if (!canvas) {
        console.error('Canvas non trouvé');
        return;
    }

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
        const isPlayersInZone = players.filter(([, player]) => {
            const zoneName = zone.name.toLowerCase().replace(/\s+/g, '');
            return player.zones[zoneName as keyof typeof player.zones];
        });

        const teamA = isPlayersInZone.filter(([, player]) => ['A', 'B'].includes(player.name));
        const isHighlighted = teamA.length > 0;
        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted,
            displayText: zone.name
        });
    });
};

export const drawAreasCD = (
    players: [string, PersonTracking][],
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D,
    zones: {
        nomansland_right: [number, number][];
        attack_right: [number, number][];
        defense_right: [number, number][];
    }
) => {
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
        const isPlayersInZone = players.filter(([, player]) => {
            const zoneName = zone.name.toLowerCase().replace(/\s+/g, '');
            return player.zones[zoneName as keyof typeof player.zones];
        });

        const teamC = isPlayersInZone.filter(([, player]) => ['C', 'D'].includes(player.name));
        const isHighlighted = teamC.length > 0;
        
        drawZonePolygon(videoWidth, videoHeight, context, {
            name: zone.name,
            points: zone.points,
            color: zone.color,
            isHighlighted,
            displayText: zone.name
        });
    });
};