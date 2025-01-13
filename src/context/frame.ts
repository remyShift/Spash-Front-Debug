import { create } from "zustand";

interface FrameStore {
    currentFrame: number;
    setCurrentFrame: (frame: number) => Promise<number>;
}

export const useFrame = create<FrameStore>((set) => ({
    currentFrame: 0,
    setCurrentFrame: (frame) => new Promise((resolve) => {
        set({ currentFrame: frame });
        resolve(frame);
    }),
}));
