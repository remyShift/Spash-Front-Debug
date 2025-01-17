export type Layers = "homography" | "players" | "ball" | "areas" | "trajectories" | "hits" | "distance" | "rebounds";

export type BallLayer = {
    coordinates: number[];
    score: number;
    rebound?: boolean;
    nextReboundFrame?: number;
}

export type HitsLayer = {
    [playerId: string]: {
        hits: number[];
    };
}