import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDarkModeAtom = atomWithStorage("darkMode", false);
export const isOpenProductFormAtom = atom(false);
export const isEditingProductIDAtom = atom<string | null>(null);

export const deleteConfirmationModalDataAtom = atom({
  isOpen: false,
  data: {
    resourcePath: "",
    id: "",
  },
});

export const searchTermAtom = atomWithStorage("SEARCH_TERM", "");
