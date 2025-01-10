export type Layers = "homography" | "players" | "ball" | "zones";

export type BallLayer = {
    coordinates: number[];
    score: number;
}