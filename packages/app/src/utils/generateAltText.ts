import { UpsetConfig, getRows } from "@visdesignlab/upset2-core";
import { getAltTextConfig } from "@visdesignlab/upset2-react";
import { api } from "../atoms/authAtoms";

export const generateAltText = async (state: UpsetConfig, data: any, verbosity: string, level: number, explain: string): Promise<string> => {
    const config = getAltTextConfig(state, data, getRows(data, state));

    const response = await api.generateAltText(verbosity, level, explain, config);
    return response.alttxt;
}