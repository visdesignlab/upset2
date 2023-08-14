import OauthClient from '@girder/oauth-client';
import { multinetApi } from 'multinet';

export const host: string =
  import.meta.env.VITE_MULTINET_HOST || 'http://localhost:8000';

export const oauthApiRoot: string =
import.meta.env.VITE_OAUTH_API_ROOT || `${host}/oauth/`;

const login_url = `${host}/oauth/`;

export const client_id = import.meta.env.VITE_OAUTH_CLIENT_ID || '';

export const multinetDatasets =
import.meta.env.VITE_UPLOAD_URL || 'http://localhost:8080';

export function getMultinetDataUrl(workspace?: string | null) {
  if (workspace) return `${multinetDatasets}/#/workspaces/${workspace}`;
  return multinetDatasets;
}

export const oAuth = new OauthClient(login_url, client_id);
export const api = multinetApi(`${host}/api`);
