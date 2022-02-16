import { multinetApi } from 'multinet';
import OauthClient from '@girder/oauth-client';
import { useEffect, useState } from 'react';
import { Upset } from '@visdesignlab/upset2-react';

const login_url = 'http://localhost:8000/oauth/';
const client_id = '7K4fAnTtGGjCKEI6RpXxCFAM5nHG9jhTmBGsSw5x';

const oauth = new OauthClient(login_url, client_id);
const api = multinetApi('http://localhost:8000/api');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      oauth.maybeRestoreLogin().then(() => setIsLoggedIn(oauth.isLoggedIn));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const f = async () => {
      console.log(isLoggedIn);
      if (isLoggedIn) {
        Object.assign(api.axios.defaults.headers.common, oauth.authHeaders);
        const workspaces = await api.workspaces();
        const workspace = workspaces.results[0];

        console.log(workspace);

        const a = await api.tables(workspace.name);
        console.log(a);
        return a;
      }
    };
    f();
  }, [isLoggedIn]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            oauth.redirectToLogin();
          }}
        >
          Login
        </button>
      </header>
      <Upset
        data={{
          sets: {},
          items: {},
          label: 'Test',
          columns: [],
          setColumns: [],
        }}
      />
    </div>
  );
}

export default App;
