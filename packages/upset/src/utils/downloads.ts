const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

const FOREIGN_OBJECT_HTML_STYLE_PROPERTIES = [
  'display',
  'visibility',
  'opacity',
  'overflow',
  'overflow-x',
  'overflow-y',
  'width',
  'height',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-overflow',
  'text-wrap',
  'white-space',
  'word-break',
  'box-sizing',
  'position',
] as const;

const FOREIGN_OBJECT_SVG_STYLE_PROPERTIES = [
  'display',
  'visibility',
  'opacity',
  'overflow',
  'width',
  'height',
  'max-width',
  'max-height',
  'position',
] as const;

const SVG_ICON_STYLE_PROPERTIES = [
  'display',
  'visibility',
  'opacity',
  'overflow',
  'color',
  'fill',
  'fill-opacity',
] as const;

const isMuiSvgIcon = (element: Element) => element.classList.contains('MuiSvgIcon-root');

const inlineSelectedStyles = (
  sourceElement: Element,
  clonedElement: Element,
  properties: readonly string[],
) => {
  const computedStyles = window.getComputedStyle(sourceElement);
  const styledElement = clonedElement as HTMLElement | SVGElement;

  properties.forEach((property) => {
    if (styledElement.style.getPropertyValue(property)) {
      return;
    }

    const value = computedStyles.getPropertyValue(property);

    if (!value) {
      return;
    }

    styledElement.style.setProperty(
      property,
      value,
      computedStyles.getPropertyPriority(property),
    );
  });
};

const serializeExportSubtree = (
  sourceElement: Element,
  clonedElement: Element,
  inForeignObject = false,
) => {
  const isInsideForeignObject =
    inForeignObject || sourceElement.localName === 'foreignObject';

  if (sourceElement.namespaceURI === XHTML_NAMESPACE) {
    clonedElement.setAttribute('xmlns', XHTML_NAMESPACE);
  }

  if (isMuiSvgIcon(sourceElement)) {
    inlineSelectedStyles(sourceElement, clonedElement, SVG_ICON_STYLE_PROPERTIES);
  } else if (isInsideForeignObject) {
    const properties =
      sourceElement.namespaceURI === XHTML_NAMESPACE
        ? FOREIGN_OBJECT_HTML_STYLE_PROPERTIES
        : FOREIGN_OBJECT_SVG_STYLE_PROPERTIES;

    inlineSelectedStyles(sourceElement, clonedElement, properties);
  }

  Array.from(sourceElement.children).forEach((child, index) => {
    const clonedChild = clonedElement.children.item(index);

    if (clonedChild) {
      serializeExportSubtree(child, clonedChild, isInsideForeignObject);
    }
  });
};

export const serializeSVGForDownload = (svg: SVGSVGElement) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  clone.setAttribute('xmlns', SVG_NAMESPACE);
  clone.setAttribute('xmlns:xlink', XLINK_NAMESPACE);
  serializeExportSubtree(svg, clone);

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
