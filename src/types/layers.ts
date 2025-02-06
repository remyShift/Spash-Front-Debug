export type AllLayers = PadelLayers | FootballLayers;

export type PadelLayers = "players" | "ball" | "areas-ab" |  "areas-cd" | "trajectories" | "hits" | "distance" | "rebounds" | "homography" | "divorces" | "top lob" | "safe ball" | "cumulative distances";
export type FootballLayers = "players" | "ball";

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