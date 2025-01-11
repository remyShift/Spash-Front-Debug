import { create } from "zustand";
import { VideoInfo } from "@/types/files";

interface Store {
    videos: VideoInfo[];
    setVideos: (videos: VideoInfo[]) => void;
}

export const useStore = create<Store>((set) => ({
    videos: [],
    setVideos: (videos) => set({ videos }),
}));