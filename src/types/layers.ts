export type Layers = "homography" | "players" | "ball" | "areas" | "trajectories";

export type BallLayer = {
    coordinates: number[];
    score: number;
}