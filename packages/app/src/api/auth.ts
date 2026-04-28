import OauthClient from '@girder/oauth-client';
import { host, clientId } from './env';

const loginUrl = `${host}/oauth/`;

export const oAuth = new OauthClient(loginUrl, clientId);
