export const calculateDistance = (
    point1: [number, number],
    point2: [number, number]
): number => {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
