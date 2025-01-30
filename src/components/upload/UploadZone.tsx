import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/Progress';

interface UploadFiles {
    mainVideo: File | null;
    pipelineJson: File | null;
    statsJson: File | null;
    playerVideos: File[];
    folderName: string;
}

interface UploadProgress {
    mainVideo: number;
    pipelineJson: number;
    statsJson: number;
    playerVideos: { [key: string]: number };
    global: number;
}

export default function UploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [files, setFiles] = useState<UploadFiles>({
        mainVideo: null,
        pipelineJson: null,
        statsJson: null,
        playerVideos: [],
        folderName: ''
    });
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        mainVideo: 0,
        pipelineJson: 0,
        statsJson: 0,
        playerVideos: {},
        global: 0
    });
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: UploadFiles = {
            ...files,
            mainVideo: null,
            pipelineJson: null,
            statsJson: null,
            playerVideos: []
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

        setFiles(newFiles);
    }, [files]);

    const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(prev => ({ ...prev, folderName: e.target.value }));
    };

    const calculateGlobalProgress = (currentProgress: UploadProgress, totalFiles: number): number => {
        const sum = currentProgress.mainVideo + 
                    currentProgress.pipelineJson + 
                    currentProgress.statsJson + 
                    Object.values(currentProgress.playerVideos).reduce((acc, curr) => acc + curr, 0);
        
        const totalPossibleProgress = totalFiles * 100;
        return Math.round((sum / totalPossibleProgress) * 100);
    };

    const handleUpload = async () => {
        if (!files.mainVideo || !files.pipelineJson || !files.statsJson || !files.folderName) {
            alert('Please provide all required files and a folder name');
            return;
        }

        setIsUploading(true);

        const uploadFile = async (file: File, fileName: string, progressKey: 'mainVideo' | 'pipelineJson' | 'statsJson' | string) => {
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

                        const totalFiles = 3 + files.playerVideos.length;
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
                            reject(new Error(`Échec de l'upload pour ${fileName} (chunk ${index})`));
                        }
                    });

                    xhr.addEventListener('error', () => {
                        reject(new Error(`Erreur réseau pour ${fileName} (chunk ${index})`));
                    });

                    xhr.open('POST', '/api/v1/upload');
                    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                    xhr.setRequestHeader('x-folder-name', files.folderName);
                    xhr.setRequestHeader('x-file-name', fileName);
                    xhr.setRequestHeader('x-chunk-index', index.toString());
                    xhr.setRequestHeader('x-total-chunks', totalChunks.toString());
                    xhr.setRequestHeader('x-file-size', file.size.toString());

                    xhr.send(chunk);
                });
            };

            try {
                for (let i = 0; i < totalChunks; i++) {
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize, file.size);
                    const chunk = file.slice(start, end);
                    await uploadChunk(chunk, i);
                }

                await updateProgress(100);
                return { success: true };
            } catch (error) {
                console.error(`Erreur lors de l'upload de ${fileName}:`, error);
                throw error;
            }
        };

        const waitForProgress = () => {
            return new Promise<void>((resolve) => {
                const checkProgress = () => {
                    setUploadProgress(prev => {
                        if (prev.global === 100) {
                            setTimeout(resolve, 100);
                        } else {
                            setTimeout(checkProgress, 100);
                        }
                        return prev;
                    });
                };
                checkProgress();
            });
        };

        try {
            await uploadFile(files.mainVideo, files.mainVideo.name, 'mainVideo');
            await uploadFile(files.pipelineJson, 'pipeline.json', 'pipelineJson');
            await uploadFile(files.statsJson, 'stats.json', 'statsJson');
            
            for (const video of files.playerVideos) {
                await uploadFile(video, video.name, `player_${video.name}`);
            }

            // S'assurer que la progression est à 100%
            await waitForProgress();
            
            // Attendre un peu avant d'afficher l'alerte
            setTimeout(() => {
                alert('Upload réussi !');
                setFiles({
                    mainVideo: null,
                    pipelineJson: null,
                    statsJson: null,
                    playerVideos: [],
                    folderName: ''
                });
                onUploadSuccess();
            }, 200);
        } catch (error) {
            alert(`Une erreur s'est produite pendant l'upload : ${error}`);
        } finally {
            setIsUploading(false);
            setUploadProgress({
                mainVideo: 0,
                pipelineJson: 0,
                statsJson: 0,
                playerVideos: {},
                global: 0
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mkv', '.avi'],
            'application/json': ['.json']
        }
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div 
                {...getRootProps()} 
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
            >
                <input {...getInputProps()} />
                <p className="text-white">
                    {isDragActive 
                        ? 'Drop the files here...' 
                        : 'Drag and drop the files here, or click to select'}
                </p>
            </div>

            {(files.mainVideo || files.pipelineJson || files.statsJson || files.playerVideos.length > 0) && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={files.folderName}
                        onChange={handleFolderNameChange}
                        placeholder="Folder name"
                        className="w-full p-2 mb-4 bg-lighterBackground text-white rounded-md"
                    />
                    <h3 className="text-white font-semibold mb-2">Selected files :</h3>
                    <ul className="space-y-2 text-white">
                        {files.mainVideo && <li>Main video : {files.mainVideo.name}</li>}
                        {files.pipelineJson && <li>Pipeline JSON : {files.pipelineJson.name}</li>}
                        {files.statsJson && <li>Stats JSON : {files.statsJson.name}</li>}
                        {files.playerVideos.map((video, index) => (
                            <li key={index}>Player video {index + 1} : {video.name}</li>
                        ))}
                    </ul>
                    <button 
                        onClick={handleUpload}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                    >
                        Upload files
                    </button>
                </div>
            )}

            {isUploading && (
                <div className="mt-4">
                    <div className="space-y-2">
                        <Progress value={uploadProgress.global} label="Progress" />
                    </div>
                </div>
            )}
        </div>
    );
} 