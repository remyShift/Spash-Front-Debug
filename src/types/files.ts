import { TimelineInterval } from "./events";

export interface VideoInfo {
    folderName: string;
    videoName: string;
    videoPath: string;
    path: string;
    size: number;
    createdAt: string;
}

export interface PlayerPair {
    player1: string;
    player2: string;
}

export interface VideoJSONPair {
    video: VideoInfo;
    json: JSONData;
}

export interface PersonTracking {
    name: string;
    bbox: [number, number, number, number];
    class: number;
    confidence: number;
    id: number;
    legs: [number, number];
    player_legs: [number, number];
    court_legs: [number, number];
};

export interface JSONData {
    path: string;
    data: {
        [frame: number]: {
            "ball.rect"?: [number, number, number, number];
            "ball.center"?: [number, number];
            "ball.center.video"?: [number, number];
            "ball.score"?: number;
            persontracking?: {
                [playerId: string]: PersonTracking;
            };
            zone?: string;
            speed?: number;
            frame_idx: number;
            detection?: string;
        };
    };
    events: {
        [event: string]: number[];
    };
    timeline: TimelineInterval[];
}

export interface StatsData {
    players: {
        name: string;
        score: number;
        video_path: string;
        sentence: string;
        positioning: {
            score: number;
            nomansland: {
                score: number;
                value: number;
                total: number;
                percentage: number;
            };
            attack: {
                score: number;
                value: number;
                total: number;
                percentage: number;
            };
            defense: {
                score: number;
                value: number;
                total: number;
                percentage: number;
            };
        };
        movement: {
            score: number;
            lob_and_go: {
                score: number;
                value: number;
                total: number;
                percentage: number;
            };
        };
        defense: {
            score: number;
            value: number;
            total: number;
            percentage: number;
        };
    }[];
}
