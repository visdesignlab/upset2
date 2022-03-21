import OauthClient from '@girder/oauth-client';
import { multinetApi } from 'multinet';

export const host: string =
  process.env.VUE_APP_MULTINET_HOST || 'http://localhost:8000';

export const oauthApiRoot: string =
  process.env.VUE_APP_OAUTH_API_ROOT || `${host}/oauth/`;

const login_url = `${host}/oauth/`;
const client_id =
  process.env.VUE_APP_OAUTH_CLIENT_ID ||
  '7K4fAnTtGGjCKEI6RpXxCFAM5nHG9jhTmBGsSw5x';

console.log({ host, oauthApiRoot, login_url, client_id });
console.log(process.env);

export const oAuth = new OauthClient(login_url, client_id);
export const api = multinetApi(`${host}/api`);
