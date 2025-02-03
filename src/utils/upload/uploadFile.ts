import { UploadProgress } from '@/types/upload';
import { calculateGlobalProgress } from './calculateProgress';

export const uploadFile = async (
    file: File, 
    fileName: string, 
    progressKey: string,
    folderName: string,
    setUploadProgress: (callback: (prev: UploadProgress) => UploadProgress) => void,
    totalFiles: number
) => {
    const chunkSize = 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedChunks = 0;

    const updateProgress = (progress: number) => {
        return new Promise<void>(resolve => {
            setUploadProgress(prev => {
                const newProgress = {
                    ...prev,
                    [progressKey]: progress,
                    ...(progressKey.includes('player') ? {
                        playerVideos: {
                            ...prev.playerVideos,
                            [fileName]: progress
                        }
                    } : {})
                };

                newProgress.global = calculateGlobalProgress(newProgress, totalFiles);
                return newProgress;
            });
            resolve();
        });
    };

    const uploadChunk = async (chunk: Blob, index: number) => {
        const xhr = new XMLHttpRequest();
        
        return new Promise((resolve, reject) => {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const chunkProgress = Math.round((event.loaded / event.total) * 100);
                    const totalProgress = Math.round(((uploadedChunks + (chunkProgress / 100)) / totalChunks) * 100);
                    updateProgress(totalProgress);
                }
            });

            xhr.addEventListener('load', async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    uploadedChunks++;
                    const progress = Math.round((uploadedChunks / totalChunks) * 100);
                    await updateProgress(progress);
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(new Error(`Error during upload of ${fileName} (chunk ${index})`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error(`Network error during upload of ${fileName} (chunk ${index})`));
            });

            xhr.open('POST', '/api/v1/upload');
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('x-folder-name', folderName);
            xhr.setRequestHeader('x-file-name', fileName);
            xhr.setRequestHeader('x-chunk-index', index.toString());
            xhr.setRequestHeader('x-total-chunks', totalChunks.toString());
            xhr.setRequestHeader('x-file-size', file.size.toString());

            xhr.send(chunk);
        });
    };

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        await uploadChunk(chunk, i);
    }

    await updateProgress(100);
    return { success: true };
}; 