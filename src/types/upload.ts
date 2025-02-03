export interface UploadFiles {
    mainVideo: File | null;
    pipelineJson: File | null;
    statsJson: File | null;
    playerVideos: File[];
    folderName: string;
}

export interface UploadProgress {
    mainVideo: number;
    pipelineJson: number;
    statsJson: number;
    playerVideos: { [key: string]: number };
    global: number;
} 