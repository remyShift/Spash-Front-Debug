import { create } from "zustand";

interface ActiveAccordionStore {
    activeAccordion: string | null;
    setActiveAccordion: (title: string | null) => void;
}

export const useActiveAccordion = create<ActiveAccordionStore>((set) => ({
    activeAccordion: null,
    setActiveAccordion: (title) => set({ activeAccordion: title }),
}));