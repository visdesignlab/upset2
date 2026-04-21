import {
  AltText, AltTextConfig, isAltText, isObject,
} from '@visdesignlab/upset2-core';
import { api } from './api';

/**
 * The actual type returned by the API
 * @private May be changed by MultiNet in the future
 */
export type AltTextResponse = {
  alttxt: AltText;
};

/**
 * Generates alternative text based on the provided configuration.
 * @param {UpsetConfig}config - The configuration object for generating alternative text.
 * @returns A promise that resolves to the generated alternative text.
 */
export async function generateAltText(config: AltTextConfig) {
  const response = await api.generateAltText(true, config);
  if (
    !isObject(response)
    || !Object.hasOwn(response, 'alttxt')
    || !isAltText((response as AltTextResponse).alttxt)
  ) console.error('Invalid alt text received from API:', response);
  return response as AltTextResponse;
}
