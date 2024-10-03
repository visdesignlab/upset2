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
import { api } from './api/api';
import { oAuth } from './api/auth';
import { client_id } from './api/env';
import { readSharedLoginCookie, writeSharedLoginCookie, invalidateSharedLoginCookie } from 'multinet';
import localforage from 'localforage';

// Not quite recommended but the only way I could get why-did-you-render to work with vite
// from https://github.com/welldone-software/why-did-you-render/issues/243#issuecomment-1112542230
if (process.env.NODE_ENV === 'development') {
  // Yes, ts complains, but it works
  const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    logOnDifferentValues: true,
    trackAllPureComponents: true,
  });
}

// import reportWebVitals from './reportWebVitals';

localforage.config({
  name: 'UpSet2-Data',
  storeName: 'upset2-data',
  description: 'Local storage for Upset2 datatable',
  size: 30 * 1024 * 1024, // Size of the database in bytes (30 MB) (used only in WEBSQL fallback driver)
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE], // fallback drivers
});

const loginTokenKey = `oauth-token-${client_id}`;
const sharedLoginCookie = readSharedLoginCookie();
if (sharedLoginCookie !== null) {
  localStorage.setItem(loginTokenKey, sharedLoginCookie);
}

oAuth.maybeRestoreLogin().then(() => {

  Object.assign(api.axios.defaults.headers.common, oAuth.authHeaders);
  
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
