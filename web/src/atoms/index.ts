import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDarkModeAtom = atomWithStorage("darkMode", false);
export const isOpenProductFormAtom = atom(false);
export const isEditingProductIDAtom = atom<string | null>(null);
