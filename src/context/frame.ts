import { create } from "zustand";

interface FrameStore {
    currentFrame: number;
    isPlaying: boolean;
    setCurrentFrame: (frame: number) => Promise<number>;
    setIsPlaying: (isPlaying: boolean) => void;
}

export const useFrame = create<FrameStore>((set) => ({
    currentFrame: 0,
    isPlaying: false,
    setCurrentFrame: (frame) => new Promise((resolve) => {
        set({ currentFrame: frame });
        resolve(frame);
    }),
    setIsPlaying: (isPlaying) => set({ isPlaying })
}));
