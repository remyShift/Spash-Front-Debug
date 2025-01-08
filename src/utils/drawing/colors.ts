const playerColors: { [key: number]: string } = {};

export const getPlayerColor = (playerId: number): string => {
    if (playerColors[playerId]) {
        return playerColors[playerId];
    }

    const colors = [
        '#FF0000', // Rouge
        '#00FF00', // Vert
        '#0000FF', // Bleu
        '#FFFF00', // Jaune
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#FFA500', // Orange
        '#800080', // Violet
        '#008000', // Vert foncé
        '#FFC0CB', // Rose
    ];

    const colorIndex = Object.keys(playerColors).length % colors.length;
    playerColors[playerId] = colors[colorIndex];
    return playerColors[playerId];
};