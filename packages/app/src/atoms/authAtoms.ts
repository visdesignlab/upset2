import OauthClient from '@girder/oauth-client';
import { multinetApi } from 'multinet';

export const host: string =
  process.env.REACT_APP_MULTINET_HOST || 'http://localhost:8000';

export const oauthApiRoot: string =
  process.env.REACT_APP_OAUTH_API_ROOT || `${host}/oauth/`;

const login_url = `${host}/oauth/`;
const client_id =
  process.env.REACT_APP_OAUTH_CLIENT_ID ||
  '7K4fAnTtGGjCKEI6RpXxCFAM5nHG9jhTmBGsSw5x';

export const multinetDatasets =
  process.env.REACT_APP_UPLOAD_URL || 'http://localhost:8080';

export function getMultinetDataUrl(workspace?: string | null) {
  if (workspace) return `${multinetDatasets}/#/workspaces/${workspace}`;
  return multinetDatasets;
}

export const oAuth = new OauthClient(login_url, client_id);
export const api = multinetApi(`${host}/api`);