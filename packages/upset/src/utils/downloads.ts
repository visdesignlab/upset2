const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

const inlineStyles = (sourceElement: Element, clonedElement: Element) => {
  const computedStyles = window.getComputedStyle(sourceElement);
  const style = Array.from(computedStyles)
    .map((property) => `${property}: ${computedStyles.getPropertyValue(property)};`)
    .join(' ');

  if (style) {
    clonedElement.setAttribute('style', style);
  }

  if (sourceElement.namespaceURI === XHTML_NAMESPACE) {
    clonedElement.setAttribute('xmlns', XHTML_NAMESPACE);
  }

  Array.from(sourceElement.children).forEach((child, index) => {
    const clonedChild = clonedElement.children.item(index);

    if (clonedChild) {
      inlineStyles(child, clonedChild);
    }
  });
};

export const serializeSVGForDownload = (svg: SVGSVGElement) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  clone.setAttribute('xmlns', SVG_NAMESPACE);
  clone.setAttribute('xmlns:xlink', XLINK_NAMESPACE);
  inlineStyles(svg, clone);

  return new XMLSerializer().serializeToString(clone);
};

/**
 * Downloads an SVG file of the current UpSet plot.
 * @param filename - The name of the downloaded file. Defaults to "upset-plot-[current date]".
 */
export function downloadSVG(filename = `upset-plot-${new Date().toJSON().slice(0, 10)}`) {
  const svg = document.getElementById('upset-svg');

  if (!(svg instanceof SVGSVGElement)) {
    console.error("Couldn't find SVG element");
    return;
  }

  const blob = new Blob([serializeSVGForDownload(svg)], { type: 'image/svg+xml' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
