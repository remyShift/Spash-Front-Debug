import { create } from "zustand";
import { Layers } from "@/types/layers";

interface ActiveLayers {
    activeLayers: Layers[];
    setActiveLayers: (activeLayers: Layers[]) => void;
}

export const useActiveLayers = create<ActiveLayers>((set) => ({
    activeLayers: [],
    setActiveLayers: (activeLayers) => set({ activeLayers }),
}));