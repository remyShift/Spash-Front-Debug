import { create } from "zustand";
import { PadelLayers, FootballLayers } from "@/types/layers";

interface ActiveLayers {
    activeLayers: (PadelLayers | FootballLayers)[];
    setActiveLayers: (activeLayers: PadelLayers[] | FootballLayers[]) => void;
    toggleActiveLayers: (layer: PadelLayers | FootballLayers) => void;
}

export const useActiveLayers = create<ActiveLayers>((set) => ({
    activeLayers: ['players'],
    setActiveLayers: (layers: PadelLayers[] | FootballLayers[]) => {
        set({ activeLayers: layers });
    },
    toggleActiveLayers: (layer: PadelLayers | FootballLayers) => {
        set((state) => {
            const isLayerActive = state.activeLayers.includes(layer);
            const newLayers = isLayerActive 
                ? state.activeLayers.filter((l) => l !== layer)
                : [...state.activeLayers, layer];
            return { activeLayers: newLayers };
        });
    },
}));