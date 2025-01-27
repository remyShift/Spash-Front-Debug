import { create } from "zustand";

interface AccordionStore {
    accordionHeight: number;
    setAccordionHeight: (height: number) => void;
}

export const useAccordionHeight = create<AccordionStore>((set) => ({
    accordionHeight: 0,
    setAccordionHeight: (height) => set({ accordionHeight: height }),
})); 