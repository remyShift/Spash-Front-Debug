import { create } from "zustand";
import { VideoInfo } from "@/types/files";

interface Store {
    videos: VideoInfo[];
    isLoading: boolean;
    setVideos: (videos: VideoInfo[]) => void;
    setIsLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
    videos: [],
    isLoading: false,
    setVideos: (videos) => set({ videos }),
    setIsLoading: (loading) => set({ isLoading: loading })
}));