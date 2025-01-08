export interface VideoInfo {
    folderName: string;
    videoName: string;
    videoPath: string;
    path: string;
    size: number;
    createdAt: string;
}

export interface VideoJSONPair {
    video: VideoInfo;
    json: JSONData;
}

export type PersonTracking = {
    bbox: [number, number, number, number];
    class: number;
    confidence: number;
    id: number;
    legs: [number, number];
    player_legs: [number, number];
};

export interface JSONData {
    path: string;
    data: {
        [frame: number]: {
            "ball.rect"?: [number, number, number, number];
            "ball.center"?: [number, number];
            "ball.center.video"?: [number, number];
            zone?: string;
            persontracking?: {
                [playerId: string]: PersonTracking;
            };
        };
    };
}

