import { UpsetConfig } from "@visdesignlab/upset2-core";
import { api } from "./api";

/**
 * Generates alternative text based on the provided configuration.
 * @param {UpsetConfig}config - The configuration object for generating alternative text.
 * @returns A promise that resolves to the generated alternative text.
 */
export async function generateAltText(config: UpsetConfig): Promise<any> {
  return api.generateAltText(true, config);
}
