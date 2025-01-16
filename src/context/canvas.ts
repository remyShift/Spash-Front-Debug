import { create } from "zustand";

interface CanvasStore {
    mainCanvasRef: React.RefObject<HTMLCanvasElement | null> | null;
    persistentCanvasRef: React.RefObject<HTMLCanvasElement | null> | null;
    setMainCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null>) => void;
    setPersistentCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null>) => void;
}

export const useCanvas = create<CanvasStore>((set) => ({
    mainCanvasRef: null,
    persistentCanvasRef: null,
    setMainCanvasRef: (ref) => set({ mainCanvasRef: ref }),
    setPersistentCanvasRef: (ref) => set({ persistentCanvasRef: ref })
}));
