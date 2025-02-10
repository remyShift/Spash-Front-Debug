import { create } from "zustand";

type Sport = 'padel' | 'foot';

interface SportStore {
    currentSport: Sport;
    setSport: (sport: Sport) => void;
}

export const useSport = create<SportStore>((set) => ({
    currentSport: "padel",
    setSport: (sport: Sport) => {
        set({ currentSport: sport });
    },
}));