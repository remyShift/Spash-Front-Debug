const renderTimes: {
    main: number[];
    persistent: number[];
} = {
    main: [],
    persistent: []
};

const MAX_SAMPLES = 30;

export const measureRenderTime = (layer: 'main' | 'persistent') => {
    const startTime = performance.now();
    return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        renderTimes[layer].push(duration);
        if (renderTimes[layer].length > MAX_SAMPLES) {
            renderTimes[layer].shift();
        }
        
        const averageTime = renderTimes[layer].reduce((sum, time) => sum + time, 0) / renderTimes[layer].length;
        return {
            current: duration,
            average: averageTime
        };
    };
}; 