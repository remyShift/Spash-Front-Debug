import { create } from "zustand";

export const useStoreVideo = create((set) => ({
    video: [],
    setVideo: (video: []) => set({ video }),
}))

export const useStoreJSON = create((set) => ({
    json: Object,
    setJSON: (json: object) => set({ json }),
}))