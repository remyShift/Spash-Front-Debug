import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/Progress';
import { UploadFiles, UploadProgress } from '@/types/upload';
import { uploadFile } from '@/utils/upload/uploadFile';
import { processDroppedFiles } from '@/utils/upload/processDroppedFiles';

export default function UploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadReady, setIsUploadReady] = useState(false);

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = processDroppedFiles(acceptedFiles, files);
        setFiles(newFiles);
        if (newFiles.mainVideo && newFiles.pipelineJson && newFiles.statsJson) {
            setIsUploadReady(true);
        }
    }, [files]);

    const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(prev => ({ ...prev, folderName: e.target.value }));
    };

    const handleUpload = async () => {
        if (!files.mainVideo || !files.pipelineJson || !files.statsJson || !files.folderName) {
            alert('Please provide all required files and a folder name');
            return;
        }

        setIsUploading(true);
        const totalFiles = 3 + files.playerVideos.length;

        try {
            await uploadFile(files.mainVideo, files.mainVideo.name, 'mainVideo', files.folderName, setUploadProgress, totalFiles);
            await uploadFile(files.pipelineJson, 'pipeline.json', 'pipelineJson', files.folderName, setUploadProgress, totalFiles);
            await uploadFile(files.statsJson, 'stats.json', 'statsJson', files.folderName, setUploadProgress, totalFiles);
            
            for (const video of files.playerVideos) {
                await uploadFile(video, video.name, `player_${video.name}`, files.folderName, setUploadProgress, totalFiles);
            }

            setTimeout(() => {
                alert('Upload successful!');
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
            alert(`An error occurred during upload: ${error}`);
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

            <div className="mt-4">
                {isUploadReady && (
                    <input
                        type="text"
                        value={files.folderName}
                        onChange={handleFolderNameChange}
                        placeholder="Folder name"
                        className="w-full p-2 mb-4 bg-lighterBackground text-white rounded-md"
                    />
                )}
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${files.mainVideo ? 'bg-green-500' : 'bg-red-500'}`} />
                        <p className="text-white">Main video {files.mainVideo && `(${files.mainVideo.name})`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${files.pipelineJson ? 'bg-green-500' : 'bg-red-500'}`} />
                        <p className="text-white">Pipeline JSON {files.pipelineJson && `(${files.pipelineJson.name})`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${files.statsJson ? 'bg-green-500' : 'bg-red-500'}`} />
                        <p className="text-white">Stats JSON {files.statsJson && `(${files.statsJson.name})`}</p>
                    </div>
                    {files.playerVideos.length > 0 && (
                        <div className="mt-2">
                            <p className="text-white font-semibold">Players videos :</p>
                            {files.playerVideos.map((video, index) => (
                                <p key={index} className="text-white ml-4">{video.name}</p>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleUpload}
                    disabled={!isUploadReady}
                    className={`w-1/3 mt-4 px-4 py-2 rounded text-white font-semibold
                        ${isUploadReady 
                            ? 'bg-primary hover:bg-primary/80' 
                            : 'bg-gray-500 cursor-not-allowed'}`}
                >
                    {isUploadReady ? 'Upload files' : 'Missing files'}
                </button>
            </div>

            {isUploading && (
                <div className="mt-4">
                    <div className="space-y-2">
                        <Progress value={uploadProgress.global} label="Progression" />
                    </div>
                </div>
            )}
        </div>
    );
} 