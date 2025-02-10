import { create } from "zustand";

export const useEditMode = create<{
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
}>((set) => ({
    editMode: false,
    setEditMode: (editMode) => set({ editMode })
}));