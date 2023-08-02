import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Box, CircularProgress, ThemeProvider } from '@mui/material';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import DefaultTheme from './components/theme';
import { api, client_id, oAuth } from './atoms/authAtoms';
import { readSharedLoginCookie, writeSharedLoginCookie, invalidateSharedLoginCookie } from 'multinet';
import { restoreQueryParam } from './atoms/queryParamAtom';

// import reportWebVitals from './reportWebVitals';

const loginTokenKey = `oauth-token-${client_id}`;
const sharedLoginCookie = readSharedLoginCookie();
if (sharedLoginCookie !== null) {
  localStorage.setItem(loginTokenKey, sharedLoginCookie);
}

oAuth.maybeRestoreLogin().then(() => {

  Object.assign(api.axios.defaults.headers.common, oAuth.authHeaders);

  restoreQueryParam();
  
  // If logged out, remove the local storage item
  if (!Object.keys(oAuth.authHeaders).includes('Authorization')) {
    localStorage.removeItem(loginTokenKey);
  }
  
  const tokenString = localStorage.getItem(loginTokenKey);
  if (tokenString !== null) {
    writeSharedLoginCookie(tokenString);
  } else {
    invalidateSharedLoginCookie();
  }

  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={DefaultTheme}>
        <RecoilRoot>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Box sx={{overflow: 'hidden'}}>
              <App />
            </Box>
          </Suspense>
        </RecoilRoot>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
