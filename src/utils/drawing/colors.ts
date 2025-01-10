const playerColors: { [key: number]: string } = {};

export const getPlayerColor = (playerId: number): string => {
    if (playerColors[playerId]) {
        return playerColors[playerId];
    }

    const colors = [
        '#8B0000', // Rouge foncé
        '#006400', // Vert foncé
        '#00008B', // Bleu foncé
        '#8B8B00', // Jaune foncé
        '#8B008B', // Magenta foncé
        '#008B8B', // Cyan foncé
        '#8B4500', // Orange foncé
        '#4B0082', // Indigo
        '#2F4F4F', // Vert-gris foncé
        '#800000', // Bordeaux
    ];

    const colorIndex = Object.keys(playerColors).length % colors.length;
    playerColors[playerId] = colors[colorIndex];
    return playerColors[playerId];
};