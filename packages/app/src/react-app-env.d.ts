/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MULTINET_HOST?: string;
  readonly VITE_OAUTH_CLIENT_ID?: string;
  readonly VITE_UPLOAD_URL?: string;
  readonly VITE_OAUTH_API_ROOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
