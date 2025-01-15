export type Layers = "homography" | "players" | "ball" | "areas" | "trajectories" | "hits";

export type BallLayer = {
    coordinates: number[];
    score: number;
}

export type HitsLayer = {
    [playerId: string]: {
        hits: number[];
    };
}