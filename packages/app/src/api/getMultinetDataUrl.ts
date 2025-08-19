import { multinetDatasets } from './env';

/**
 * Returns the URL for the Multinet data based on the provided workspace.
 * If no workspace is provided, the default Multinet datasets URL is returned.
 *
 * @param workspace - The workspace to fetch the URL for.
 * @param queryParams - Optional query parameters to append to the URL.
 *                      These should be provided as an object where keys are parameter names and values are parameter values
 * @returns The URL for the Multinet data.
 */
export function getMultinetDataUrl(
  workspace?: string | null,
  queryParams?: Record<string, string | number | boolean>,
): string {
  if (workspace) {
    if (queryParams) {
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      return `${multinetDatasets}/#/workspaces/${workspace}?${queryString}`;
    }

    return `${multinetDatasets}/#/workspaces/${workspace}`;
  }

  return multinetDatasets;
}
