import { selector } from 'recoil';

import { api, oAuth } from './authAtoms';

export const logInStatusSelector = selector({
  key: 'login_status',
  get: async () => {
    await oAuth.maybeRestoreLogin();

    if (oAuth.isLoggedIn) {
      Object.assign(api.axios.defaults.headers.common, oAuth.authHeaders);

      const retrivedSearch = window.localStorage.getItem('preserve-qp');

      if (retrivedSearch && retrivedSearch.length > 0) {
        console.log('Detected saved qp');
        window.location.search = retrivedSearch;
        window.localStorage.removeItem('preserve-qp');
        console.log(retrivedSearch);
      }

      return true;
    }

    const { search } = window.location;

    if (search.length > 0) {
      window.localStorage.setItem('preserve-qp', search);
    }

    oAuth.redirectToLogin();
    return false;
  },
});
