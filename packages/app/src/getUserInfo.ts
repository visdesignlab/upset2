import { api } from './atoms/authAtoms';

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
