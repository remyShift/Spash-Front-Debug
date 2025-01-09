import { create } from "zustand";

interface FrameStore {
    currentFrame: number;
    setCurrentFrame: (frame: number) => void;
}

export const useFrame = create<FrameStore>((set) => ({
    currentFrame: 0,
    setCurrentFrame: (frame) => set({ currentFrame: frame }),
}));