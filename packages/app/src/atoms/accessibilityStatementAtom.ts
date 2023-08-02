import { atom } from "recoil";

export const accessibilityStatementAtom = atom<boolean>({
    key: 'accessibility-statement',
    default: false,
});