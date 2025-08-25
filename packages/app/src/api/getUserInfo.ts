import { SingleUserWorkspacePermissionSpec } from 'multinet';
import { api } from './api';

/**
 * Retrieves user information from the API.
 * @returns {Promise<any>} A promise that resolves to the user information.
 * @throws {Error} If an error occurs while retrieving the user information.
 */
export const getUserInfo = async () => {
  try {
    const info = await api.userInfo();
    return info;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.response && e.response.status === 401) {
      return null;
    }
    throw new Error(e);
  }
};

/**
 * Gets permissions for the current user from the Multinet API
 * @param workspace The current workspace name
 * @returns An object containing the user's permissions, or null if an error occurs
 */
export async function getUserPermissions(
  workspace: string,
): Promise<SingleUserWorkspacePermissionSpec | null> {
  try {
    return await api.getCurrentUserWorkspacePermissions(workspace);
  } catch {
    return null;
  }
}
