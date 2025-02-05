import { create } from "zustand";

export const useHomographyPoints = create<{
    homographyPoints: { [key: string]: { camera: number[] } };
    setHomographyPoints: (points: { [key: string]: { camera: number[] } }) => void;
}>((set) => ({
    homographyPoints: {},
    setHomographyPoints: (points) => set({ homographyPoints: points }),
}));
