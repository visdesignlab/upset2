import { api } from "./api";

/**
 * Retrieves user information from the API.
 * @returns {Promise<any>} A promise that resolves to the user information.
 * @throws {Error} If an error occurs while retrieving the user information.
 */
export const getUserInfo = async () => {
  try {
    const info = await api.userInfo();
    return info;
  } catch (e: any) {
    if (e.response && e.response.status === 401) {
      return null;
    }
    throw new Error(e);
  }
}
