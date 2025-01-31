const playerColors: { [key: number]: string } = {};

export const getPlayerColor = (playerId: number): string => {
    if (playerColors[playerId]) {
        return playerColors[playerId];
    }

    const colors = [
        '#FF0000', // Rouge
        '#008000', // Vert
        '#A9A9A9', // Gris foncé
        '#FF00FF', // Rose
    ];

    const colorIndex = Object.keys(playerColors).length % colors.length;
    playerColors[playerId] = colors[colorIndex];
    return playerColors[playerId];
};