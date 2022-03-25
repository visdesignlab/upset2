import { selector } from 'recoil';

import { api, oAuth } from './authAtoms';

export const logInStatusSelector = selector({
  key: 'login-status',
  get: async () => {
    await oAuth.maybeRestoreLogin();
    if (oAuth.isLoggedIn) {
      Object.assign(api.axios.defaults.headers.common, oAuth.authHeaders);
      return true;
    }
    oAuth.redirectToLogin();
    return false;
  },
});
