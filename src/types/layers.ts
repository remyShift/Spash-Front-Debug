export type Layers = "players" | "ball" | "areas" | "trajectories" | "hits" | "distance" | "rebounds" | "homography";

export type BallLayer = {
    coordinates: number[];
    score: number;
    speed?: number;
    rebound?: boolean;
    nextReboundFrame?: number;
}

export type HitsLayer = {
    [playerId: string]: {
        hits: number[];
    };
}