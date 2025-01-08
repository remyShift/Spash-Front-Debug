import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VideoInfo } from "@/types/files";

export interface JSONData {
    path: string;
    data: {
        [frame: number]: {
            [key: string]: {
                rect: [number, number, number, number];
            };
        };
    };
}

export interface VideoJSONPair {
    video: VideoInfo;
    json: JSONData | null;
}

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