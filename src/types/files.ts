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
            "ball.score"?: number;
            zone?: string;
            persontracking?: {
                [playerId: string]: PersonTracking;
            };
            frame_idx?: number;
            detection?: string;
            speed?: string;
        };
    };
    events: {
        [event: string]: number[];
    };
    timeline: {
        [event: string]: {
            start: number;
            end: number;
            type: string;
        };
    };
}

