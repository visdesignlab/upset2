/**
 * Downloads an SVG file of the current UpSet plot.
 * @param filename - The name of the downloaded file. Defaults to "upset-plot-[current date]".
 */
export function downloadSVG(
  filename = `upset-plot-${new Date().toJSON().slice(0, 10)}`,
) {
  const svg = document.getElementById('upset-svg');

  if (!svg) {
    // eslint-disable-next-line no-console
    console.error("Couldn't find SVG element");
    return;
  }

  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
