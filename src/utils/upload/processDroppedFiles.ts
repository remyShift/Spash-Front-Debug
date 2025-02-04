import { UploadFiles } from '@/types/upload';

export const processDroppedFiles = (acceptedFiles: File[], currentFiles: UploadFiles): UploadFiles => {
    const newFiles: UploadFiles = {
        ...currentFiles,
        playerVideos: [...currentFiles.playerVideos]
    };

    acceptedFiles.forEach(file => {
        if (file.type.startsWith('video/')) {
            if (file.name.includes('player')) {
                newFiles.playerVideos.push(file);
            } else {
                newFiles.mainVideo = file;
            }
        } else if (file.type === 'application/json') {
            if (file.name === 'stats.json') {
                newFiles.statsJson = file;
            } else {
                newFiles.pipelineJson = file;
            }
        }
    });

    return newFiles;
}; 