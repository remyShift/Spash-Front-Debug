import { create } from "zustand";

interface EventsFiltersState {
    eventsFilters: string[];
    setEventsFilters: (events: string[]) => void;
}

export const useEventsFilters = create<EventsFiltersState>((set) => ({
    eventsFilters: [],
    setEventsFilters: (eventsFilters: string[]) => set({ eventsFilters }),
}));
