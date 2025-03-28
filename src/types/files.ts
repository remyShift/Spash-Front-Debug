import { TimelineInterval } from "./events";

export interface VideoInfo {
    folderName: string;
    videoName: string;
    videoPath: string;
    pipelineJsonName: string;
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
    id: number;
    old_id: number;
    team: string;
    legs: [number, number];
    player_legs: [number, number];
    speed_legs: number;
    court_legs: [number, number];
    player2D: [number, number];
    goalkeeper: boolean;
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
    hit_count?: {
        service: number;
        lob: number;
        hit: number;
    };
    zone_count?: {
        nomansland: number;
        attack: number;
        defense: number;
    };
    cumulate_distance?: number;
};

export interface TeamsFoot {
    id: number;
    is_attacking: boolean;
    is_defending: boolean;
    is_possessing: boolean;
};

export interface JSONInfo {
    video: {
        width: number;
        height: number;
        fps: number;
        start: number;
        end: number;
    };
    cfg: {
        sport: "padel" | "foot";
    };
    homography: HomographyPoint[];
}

export interface JSONData {
    info: JSONInfo;
    path: string;
    data: {
        [frame: string]: {
            "ball.rect"?: [number, number, number, number];
            "ball.center"?: [number, number];
            "ball.center.video"?: [number, number];
            "ball.court"?: [number, number];
            "ball.possession"?: number;
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
            team_checks?: boolean;
            team_checks_players?: string[];
            teams?:{
                [id: number]: TeamsFoot;
            }
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
        zone_right: [number, number][];
        zone_left: [number, number][];
        zone_mid: [number, number][];
        zone_1: [number, number][];
        zone_2: [number, number][];
        zone_3: [number, number][];
        zone_4: [number, number][];
        top_corridor: [number, number][];
        mid_corridor: [number, number][];
        bottom_corridor: [number, number][];
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

export interface JSONFootStats {
    teams: {
        id: number;
        side: string;
        general: {
            score: number;
            distance: {
                score: number;
            };
            max_speed: {
                score: number;
            };
            zone_coverage: {
                score: number;
            };
        };
        attack: {
            score: number;
            att_initiated: {
                score: number;
            };
            time_in_att: {
                score: number;
            };
            att_height: {
                score: number;
            };
            att_pres: {
                score: number;
            };
        };
        defense: {
            score: number;
            time_in_def: {
                score: number;
            };
            def_height: {
                score: number;
            };
            def_pres: {
                score: number;
            };
            att_under: {
                score: number;
            };
        };
        game: {
            score: number;
            possession: {
                score: number;
            };
            longest_possession: {
                score: number;
            };
        };
        physical: {
            score: number;
            mean_speed: {
                score: number;
            };
        };
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

export interface HomographyPoint {
    name: string;
    camera: [number, number];
    object: [number, number];
}