import { selector } from 'recoil';

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
