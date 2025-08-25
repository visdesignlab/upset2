import { ProvenanceGraph } from '@trrack/core/graph/graph-slice';
import { UpsetConfig } from '@visdesignlab/upset2-core';
import { api } from './api';
import { WorkspacePermissionsSpec } from 'multinet';

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

export function updateWorkspacePrivacy(
  workspace: string,
  workspacePerms: WorkspacePermissionsSpec,
  privacy: boolean,
) {
  api.setWorkspacePermissions(workspace, {
    ...workspacePerms,
    public: privacy,
  });
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

/**
 * Set the public visibility of a workspace.
 * @param workspace Name of the workspace
 * @param isPublic Whether the workspace should be public
 * @returns True if successful, false if the operation fails (due to insufficient permissions or otherwise)
 */
export async function setWorkspacePrivacy(
  workspace: string,
  isPublic: boolean,
): Promise<boolean> {
  try {
    const perms = await api.getWorkspacePermissions(workspace);
    if (perms) {
      await api.setWorkspacePermissions(workspace, {
        ...perms,
        public: isPublic,
      });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
