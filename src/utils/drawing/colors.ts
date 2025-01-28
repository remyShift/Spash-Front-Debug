const playerColors: { [key: number]: string } = {};

export const getPlayerColor = (playerId: number): string => {
    if (playerColors[playerId]) {
        return playerColors[playerId];
    }

    const colors = [
        '#FF7F7F', // Rouge clair
        '#66CDAA', // Vert clair
        '#FFB6C1', // Rose clair
        '#FFA07A', // Orange clair
    ];

    const colorIndex = Object.keys(playerColors).length % colors.length;
    playerColors[playerId] = colors[colorIndex];
    return playerColors[playerId];
};