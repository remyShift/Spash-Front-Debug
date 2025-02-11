import { create } from "zustand";

interface ModeState {
    mode: "dev" | "commercial";
}

interface ModeActions {
    setMode: (mode: "dev" | "commercial") => void;
}

const initialState: ModeState = {
    mode: "commercial",
};

export const useMode = create<ModeState & ModeActions>((set) => ({
    ...initialState,
    setMode: (mode) => set({ mode }),
}));

