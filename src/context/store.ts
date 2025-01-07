import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VideoInfo } from "@/types/files";

interface VideoStore {
    videos: VideoInfo[];
    setVideos: (videos: VideoInfo[]) => void;
}

interface JSONStore {
    json: object[];
    setJSON: (json: object[]) => void;
}

export const useStoreVideo = create<VideoStore>()(
    persist(
        (set) => ({
            videos: [],
            setVideos: (videos) => set({ videos }),
        }),
        {
            name: 'video-storage',
        }
    )
);

export const useStoreJSON = create<JSONStore>()(
    persist(
        (set) => ({
            json: [],
            setJSON: (json) => set({ json }),
        }),
        {
            name: 'json-storage',
        }
    )
);