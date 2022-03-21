import OauthClient from '@girder/oauth-client';
import { multinetApi } from 'multinet';

const login_url =
  process.env.VUE_APP_OAUTH_API_ROOT || 'http://localhost:8000/oauth/';
const client_id =
  process.env.VUE_APP_OAUTH_CLIENT_ID ||
  '7K4fAnTtGGjCKEI6RpXxCFAM5nHG9jhTmBGsSw5x';

export const oAuth = new OauthClient(login_url, client_id);
export const api = multinetApi('http://localhost:8000/api');
