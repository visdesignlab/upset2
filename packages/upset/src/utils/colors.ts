/* eslint-disable no-bitwise */
// from https://natclark.com/tutorials/javascript-lighten-darken-hex-color/
// bitwise operation for generating shades of hex values
export const newShade = (hexColor: string, magnitude: number) => {
  const normalizedHex = hexColor.replace('#', '');

  if (normalizedHex.length !== 6) {
    return normalizedHex;
  }

  const decimalColor = parseInt(normalizedHex, 16);
  const clamp = (value: number) => Math.max(0, Math.min(255, value));

  const r = clamp(((decimalColor >> 16) & 0x00ff) + magnitude);
  const g = clamp(((decimalColor >> 8) & 0x00ff) + magnitude);
  const b = clamp((decimalColor & 0x00ff) + magnitude);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};
