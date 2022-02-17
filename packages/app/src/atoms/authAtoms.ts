import OauthClient from '@girder/oauth-client';
import { multinetApi } from 'multinet';

const login_url = 'http://localhost:8000/oauth/';
const client_id = '7K4fAnTtGGjCKEI6RpXxCFAM5nHG9jhTmBGsSw5x';

export const oAuth = new OauthClient(login_url, client_id);
export const api = multinetApi('http://localhost:8000/api');
