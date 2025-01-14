import { create } from "zustand";

interface ActiveTimelineStore {
    activeTimeline: string | null;
    setActiveTimeline: (timeline: string | null) => void;
}

export const useActiveTimeline = create<ActiveTimelineStore>((set) => ({
    activeTimeline: null,
    setActiveTimeline: (timeline) => set({ activeTimeline: timeline }),
}));
