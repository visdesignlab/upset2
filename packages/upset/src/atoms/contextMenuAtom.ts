import { atom } from "recoil";

type Props = {
    mouseX: number, 
    mouseY: number, 
    id: string, 
    items: {
        label: string,
        onClick: () => any,
        disabled?: boolean
    }[]
}

export const contextMenuAtom = atom<Props | null>({
    key: 'context-menu-display-state',
    default: null,
});
