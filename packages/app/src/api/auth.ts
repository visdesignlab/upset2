import OauthClient from '@girder/oauth-client';
import { host, client_id } from './env';

const login_url = `${host}/oauth/`;

export const oAuth = new OauthClient(login_url, client_id);
