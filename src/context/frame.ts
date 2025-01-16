import { create } from "zustand";

interface FrameStore {
    currentFrame: number;
    isPlaying: boolean;
    setCurrentFrame: (frame: number) => Promise<void>;
    setIsPlaying: (isPlaying: boolean) => void;
}

export const useFrame = create<FrameStore>((set, get) => ({
    currentFrame: 0,
    isPlaying: false,
    setCurrentFrame: async (frame) => {
        const currentState = get();
        if (currentState.currentFrame !== frame) {
            set({ currentFrame: frame });
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        }
    },
    setIsPlaying: (isPlaying) => set({ isPlaying })
}));
