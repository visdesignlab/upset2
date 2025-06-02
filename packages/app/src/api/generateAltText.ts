import { AltText, isAltText, UpsetConfig } from '@visdesignlab/upset2-core';
import { api } from './api';

/**
 * Generates alternative text based on the provided configuration.
 * @param {UpsetConfig}config - The configuration object for generating alternative text.
 * @returns A promise that resolves to the generated alternative text.
 */
export async function generateAltText(config: UpsetConfig): Promise<AltText> {
  const response = await api.generateAltText(true, config);
  if (!isAltText(response.alttxt))
    console.error('Invalid alt text received from API:', response.alttxt);
  return response.alttxt;
}
