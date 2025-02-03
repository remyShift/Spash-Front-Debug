import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/Progress';
import { UploadFiles, UploadProgress } from '@/types/upload';
import { processDroppedFiles } from '@/utils/upload/processDroppedFiles';
import { uploadFile } from '@/utils/upload/uploadFile';

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
        const newFiles = processDroppedFiles(acceptedFiles, files);
        setFiles(newFiles);
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