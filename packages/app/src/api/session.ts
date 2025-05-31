import { ProvenanceGraph } from '@trrack/core/graph/graph-slice';
import { UpsetConfig } from '@visdesignlab/upset2-core';
import { api } from './api';

/**
 * Updates a Multinet session.
 *
 * @param {string}workspace - The workspace where the session belongs.
 * @param {string}sessionId - The ID of the session to update.
 * @param {ProvenanceGraph<UpsetConfig, string>}provObject - The updated session object.
 */
export function updateMultinetSession(
  workspace: string,
  sessionId: string,
  provObject: ProvenanceGraph<UpsetConfig, string>,
) {
  api.updateSession(workspace, parseInt(sessionId), 'table', provObject);
}

/**
 * Retrieves a Multinet session from the Multinet API.
 *
 * @param {string}workspace - The workspace where the session belongs.
 * @param {string}sessionId - The ID of the session to retrieve.
 * @returns A promise that resolves to the retrieved session.
 */
export async function getMultinetSession(workspace: string, sessionId: string) {
  try {
    return await api.getSession(workspace, parseInt(sessionId), 'table');
  } catch {
    return null;
  }
}
