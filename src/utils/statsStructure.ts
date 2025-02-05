export const extractStatsStructure = (player: object) => {
    const structure = [];
    
    for (const [key, value] of Object.entries(player)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const subcategories = Object.keys(value)
                .filter(subKey => typeof value[subKey] === 'object' && 'score' in value[subKey]);
            
            if (subcategories.length > 0) {
                structure.push({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    key,
                    rowCount: subcategories.length + 1,
                    subcategories
                });
            }
        } else if (key === 'badges') {
            structure.push({
                name: 'Badges',
                key: 'badges',
                rowCount: 3,
                type: 'badges'
            });
        } else if (key === 'sentence') {
            structure.push({
                name: 'Sentence',
                key: 'sentence',
                rowCount: 2,
                type: 'text'
            });
        } else if (key === 'video_path') {
            structure.push({
                name: 'Video',
                key: 'video_path',
                rowCount: 3,
                type: 'media'
            });
        }
    }
    
    return structure;
}; 