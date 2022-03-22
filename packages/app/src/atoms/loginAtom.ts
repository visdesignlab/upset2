import { selector } from 'recoil';

import { api, oAuth } from './authAtoms';
import { restoreQueryParam, saveQueryParam } from './queryParamAtom';

export const logInStatusSelector = selector({
  key: 'login_status',
  get: async () => {
    await oAuth.maybeRestoreLogin();

    if (oAuth.isLoggedIn) {
      Object.assign(api.axios.defaults.headers.common, oAuth.authHeaders);
      restoreQueryParam();
      return true;
    }

    saveQueryParam();
    oAuth.redirectToLogin();
    return false;
  },
});
