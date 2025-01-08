import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VideoJSONPair } from "@/types/files";

interface Store {
    pairs: VideoJSONPair[];
    setPairs: (pairs: VideoJSONPair[]) => void;
}

export const useStore = create<Store>()(
    persist(
        (set) => ({
        pairs: [],
        setPairs: (pairs) => set({ pairs }),
        }),
        {
            name: 'video-json-storage',
        }
    )
);