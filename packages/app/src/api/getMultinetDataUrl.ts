import { multinetDatasets } from "./env";

/**
 * Returns the URL for the Multinet data based on the provided workspace.
 * If no workspace is provided, the default Multinet datasets URL is returned.
 *
 * @param workspace - The workspace to fetch the URL for.
 * @returns The URL for the Multinet data.
 */
export function getMultinetDataUrl(workspace?: string | null) {
  if (workspace) return `${multinetDatasets}/#/workspaces/${workspace}`;
  return multinetDatasets;
}
