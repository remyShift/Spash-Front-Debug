import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadFiles {
    mainVideo: File | null;
    pipelineJson: File | null;
    statsJson: File | null;
    playerVideos: File[];
    folderName: string;
}

export default function UploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [files, setFiles] = useState<UploadFiles>({
        mainVideo: null,
        pipelineJson: null,
        statsJson: null,
        playerVideos: [],
        folderName: ''
    });

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

    const handleUpload = async () => {
        if (!files.mainVideo || !files.pipelineJson || !files.statsJson || !files.folderName) {
            alert('Please provide all required files and a folder name');
            return;
        }

        const formData = new FormData();
        formData.append('mainVideo', files.mainVideo);
        formData.append('pipelineJson', files.pipelineJson);
        formData.append('statsJson', files.statsJson);
        formData.append('folderName', files.folderName);
        files.playerVideos.forEach(video => {
            formData.append('playerVideos', video);
        });

        const response = await fetch('/api/v1/upload', {
            method: 'POST',
            body: formData
        });
            
        if (response.ok) {
            alert('Upload successful !');
            setFiles({
                mainVideo: null,
                pipelineJson: null,
                statsJson: null,
                playerVideos: [],
                folderName: ''
            });
            onUploadSuccess();
        } else {
            alert(`An error occurred during upload : ${response.statusText}`);
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
        </div>
    );
} 