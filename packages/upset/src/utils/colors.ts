/* eslint-disable no-unused-expressions */
/* eslint-disable no-bitwise */
// from https://natclark.com/tutorials/javascript-lighten-darken-hex-color/
// bitwise operation for generating shades of hex values
export const newShade = (hexColor: string, magnitude: number) => {
  hexColor = hexColor.replace('#', '');
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);

    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  }

  return hexColor;
};
