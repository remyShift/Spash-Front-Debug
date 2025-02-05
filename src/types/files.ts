import { TimelineInterval } from "./events";

export interface VideoInfo {
    folderName: string;
    videoName: string;
    videoPath: string;
    path: string;
    size: number;
    createdAt: string;
    playerVideoPath: {
        [key: string]: string;
    };
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
    confidence: number;
    class?: number;
    id?: number;
    old_id: number;
    legs: [number, number];
    player_legs: [number, number];
    speed_legs: number;
    court_legs: [number, number];
    zones: {
        attack: boolean;
        defense: boolean;
        nomansland: boolean;
    };
    do_hit: {
        service: boolean;
        lob: boolean;
        hit: boolean;
    };
    hit_count: {
        service: number;
        lob: number;
        hit: number;
    };
    cumulate_distance?: number;
};

export interface JSONData {
    info: {
        video: {
            width: number;
            height: number;
            fps: number;
            start: number;
            end: number;
        };
        cfg: {
            sport: string;
        };
    };
    path: string;
    data: {
        [frame: string]: {
            "ball.rect"?: [number, number, number, number];
            "ball.center"?: [number, number];
            "ball.center.video"?: [number, number];
            "ball.score"?: number;
            "ball.zones"?: {
                divorce_zone_right?: boolean;
                divorce_zone_left?: boolean;
                top_lob_right?: boolean;
                top_lob_left?: boolean;
                safe_ball_right?: boolean;
                safe_ball_left?: boolean;
            };
            persontracking?: {
                [playerId: string]: PersonTracking;
            };
            zone?: string;
            speed?: number;
            frame_idx: number;
            detection?: string;
            isPlaying?: boolean;
        };
    };
    events: {
        [event: string]: number[];
    };
    timeline: TimelineInterval[];
    stats: {
        players: {
            [key: string]: PlayerStats;
        };
    };
    zones: {
        homography: number[][][];
        nomansland_right: [number, number][];
        nomansland_left: [number, number][];
        attack_right: [number, number][];
        attack_left: [number, number][];
        defense_right: [number, number][];
        defense_left: [number, number][];
        divorce_right: [number, number][];
        divorce_left: [number, number][];
        balle_sure_right: [number, number][];
        balle_sure_left: [number, number][];
        toplob_right: [number, number][];
        toplob_left: [number, number][];
    };
}

export interface JSONStats {
    players: {
        name: string;
        score: number;
        video_path: string;
        sentence: string;
        positioning: {
            score: number;
            nomansland: {
                score: number;
            };
            attack: {
                score: number;
            };
            defense: {
                score: number;
            };
        };
        movement: {
            score: number;
            lob_and_go: {
                score: number;
            };
            net_taking: {
                score: number;
            };
            attack_position: {
                score: number;
            };
            hit_and_move: {
                score: number;
            };
        };
        tactical: {
            score: number;
            first_serve: {
                score: number;
            };
            volley_service: {
                score: number;
            };
            services: {
                score: number;
            };
            diagonal: {
                score: number;
            };
            top_lob: {
                score: number;
            };
            divorce_zone: {
                score: number;
            };
            safe_ball: {
                score: number;
            };
        };
        teams: {
            chain_breaks: {
                score: number;
            };
            checks: {
                score: number;
            };
            score: number;
        };
        physical: {
            score: number;
            distance: {
                score: number;
            };
            calories: {
                score: number;
            };
            intensities: {
                score: number;
            };
        };
        badges: {
            badge_type: string;
            value: number;
            top_badge: boolean;
        }[];
    }[];
    reels: {
        reel_type: string;
        team_id: number;
        end_frame: number;
        duration: number;
        end_timecode: number;
    }[];
}

export interface PlayerStats {
    side: string;
    hits: number[];
    lobs: number[];
    services: number[];
    zone_counts: {
        [zone: string]: number;
    };
    video_path: string;
    sentence: string;
}

export interface PlayerHits {
    [playerId: string]: PlayerStats;
}