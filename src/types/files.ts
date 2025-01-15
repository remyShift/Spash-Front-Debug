import { TimelineInterval } from "./events";

export interface VideoInfo {
    folderName: string;
    videoName: string;
    videoPath: string;
    playerVideoPath: {
        player1: string;
        player2: string;
        player3: string;
        player4: string;
    };
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
            net_taking: {
                score: number;
                value: number;
                total: number;
                percentage: number;
            };
            attack_position: {
                score: number;
                value: number;
            };
            hit_and_move: {
                score: number;
                value: number;
            };
        };
        tactical: {
            score: number;
            first_serve: {
                score: number;
                value: number;
            };
            volley_service: {
                score: number;
                value: number;
            };
            services: {
                score: number;
                value: number;
            };
            diagonal: {
                score: number;
                value: number;
            };
            top_lob: {
                score: number;
                value: number;
            };
            divorce_zone: {
                score: number;
                value: number;
            };
            safe_ball: {
                score: number;
                value: number;
            };
        };
        teams: {
            chain_breaks: {
                score: number;
                value: number;
            };
            checks: {
                score: number;
                value: number;
            };
            score: number;
        };
        physical: {
            score: number;
            distance: {
                score: number;
                total: number;
                details: {
                    [key: string]: number;
                };
            };
            calories: {
                score: number;
                value: number;
            };
            intensities: {
                score: number;
                max_speed: number;
            };
        };
        badges: {
            badge_type: string;
            value: number;
            top_badge: boolean;
        }[];
    }[];
}