import { RenderTiming } from "@/types/performance";
import { create } from "zustand";

interface PerformanceState {
    mainTiming: RenderTiming | null;
    persistentTiming: RenderTiming | null;
    setMainTiming: (timing: RenderTiming) => void;
    setPersistentTiming: (timing: RenderTiming) => void;
}

export const usePerformance = create<PerformanceState>()((set) => ({
    mainTiming: null,
    persistentTiming: null,
    setMainTiming: (timing: RenderTiming) => set({ mainTiming: timing }),
    setPersistentTiming: (timing: RenderTiming) => set({ persistentTiming: timing }),
}));