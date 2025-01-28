import { create } from "zustand";
import { Layers } from "@/types/layers";

interface ActiveLayers {
    activeLayers: Layers[];
    setActiveLayers: (activeLayers: Layers[]) => void;
    toggleActiveLayers: (layer: Layers) => void;
}

export const useActiveLayers = create<ActiveLayers>((set) => ({
    activeLayers: ["players"],
    setActiveLayers: (layers: Layers[]) => {
        set({ activeLayers: layers });
    },
    toggleActiveLayers: (layer: Layers) => {
        set((state) => {
            const isLayerActive = state.activeLayers.includes(layer);
            const newLayers = isLayerActive 
                ? state.activeLayers.filter((l) => l !== layer)
                : [...state.activeLayers, layer];
            return { activeLayers: newLayers };
        });
    },
}));