import { HomographyPoint } from "@/types/files";
import { create } from "zustand";

interface HomographyPointsState {
    homographyPoints: { [key: string]: HomographyPoint };
    setHomographyPoints: (points: HomographyPoint[]) => void;
}

export const useHomographyPoints = create<HomographyPointsState>((set) => ({
    homographyPoints: {},
    setHomographyPoints: (points: HomographyPoint[]) => {
        const pointsObject = points.reduce<{ [key: string]: HomographyPoint }>((acc, point) => {
            acc[point.name] = point;
            return acc;
        }, {});
        set({ homographyPoints: pointsObject });
    }
}));
