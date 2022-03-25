import { selector } from 'recoil';

const QUERY_PARAM_KEY = 'pre-redirect-query-param';

export const queryParamAtom = selector({
  key: 'query-params',
  get: () => {
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const workspace = searchParams.get('workspace');
    const table = searchParams.get('table');

    return { workspace, table };
  },
});

export function saveQueryParam() {
  const { search } = window.location;

  if (search.length > 0) {
    window.localStorage.setItem(QUERY_PARAM_KEY, search);
  }
}

export function doesHaveSavedQueryParam() {
  return window.localStorage.getItem(QUERY_PARAM_KEY) !== null;
}

export function restoreQueryParam() {
  const retrivedSearch = window.localStorage.getItem(QUERY_PARAM_KEY);

  if (retrivedSearch && retrivedSearch.length > 0) {
    if (!window.location.search.includes(retrivedSearch)) {
      window.localStorage.removeItem(QUERY_PARAM_KEY);
      window.location.search = retrivedSearch;
    }
  }
}
