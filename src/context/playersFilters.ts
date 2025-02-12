import { create } from "zustand";

interface PlayersFiltersState {
    playersFilters: string[];
    setPlayersFilters: (players: string[]) => void;
}

export const usePlayersFilters = create<PlayersFiltersState>((set) => ({
    playersFilters: [],
    setPlayersFilters: (playersFilters: string[]) => set({ playersFilters }),
}));
