import { create } from "zustand";

interface FrameStore {
    currentFrame: number;
    frameQueue: number[];
    isPlaying: boolean;
    setCurrentFrame: (frame: number) => Promise<void>;
    addToFrameQueue: (frame: number) => void;
    clearFrameQueue: () => void;
    setIsPlaying: (isPlaying: boolean) => void;
}

export const useFrame = create<FrameStore>((set, get) => ({
    currentFrame: 0,
    frameQueue: [],
    isPlaying: false,
    setCurrentFrame: async (frame) => {
        const currentState = get();
        const newFrame = Math.round(frame);
        if (currentState.currentFrame !== newFrame) {
            requestAnimationFrame(() => {
                set({ currentFrame: newFrame });
            });
        }
    },
    addToFrameQueue: (frame: number) => {
        set(state => ({
            frameQueue: [...state.frameQueue, frame]
        }));
    },
    clearFrameQueue: () => set({ frameQueue: [] }),
    setIsPlaying: (isPlaying) => set({ isPlaying })
}));
