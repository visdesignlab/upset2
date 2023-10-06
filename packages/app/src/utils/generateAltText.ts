import { UpsetConfig, getRows } from "@visdesignlab/upset2-core";
import { getAltTextConfig } from "@visdesignlab/upset2-react";
import { api } from "../atoms/authAtoms";

export const generateAltText = async (state: UpsetConfig, data: any, verbosity: string, explain: string): Promise<string> => {
    const config = getAltTextConfig(state, data, getRows(data, state));

    const response = await api.generateAltText(verbosity, 2, explain, config);
    return response.alttxt;
}