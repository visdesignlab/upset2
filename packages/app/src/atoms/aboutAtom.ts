import { atom } from "recoil";

export const aboutAtom = atom<boolean>({
    key: 'about-modal',
    default: false,
});