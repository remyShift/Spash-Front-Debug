import { create } from "zustand";

type Sport = 'padel' | 'foot';

interface SportStore {
    sport: Sport;
    setSport: (sport: Sport) => void;
}

export const useSport = create<SportStore>((set) => ({
    sport: "padel",
    setSport: (sport: Sport) => {
        set({ sport: sport });
    },
}));