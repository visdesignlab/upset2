export const host: string = import.meta.env.VITE_MULTINET_HOST || 'http://localhost:8000';

export const client_id = import.meta.env.VITE_OAUTH_CLIENT_ID || '';

export const multinetDatasets = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:8080';

export const oauthApiRoot: string = import.meta.env.VITE_OAUTH_API_ROOT || `${host}/oauth/`;
