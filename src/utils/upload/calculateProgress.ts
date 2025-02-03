import { UploadProgress } from '@/types/upload';

export const calculateGlobalProgress = (currentProgress: UploadProgress, totalFiles: number): number => {
    const sum = currentProgress.mainVideo + 
                currentProgress.pipelineJson + 
                currentProgress.statsJson + 
                Object.values(currentProgress.playerVideos).reduce((acc, curr) => acc + curr, 0);
    
    const totalPossibleProgress = totalFiles * 100;
    return Math.round((sum / totalPossibleProgress) * 100);
}; 