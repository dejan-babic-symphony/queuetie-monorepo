/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string;
  readonly VITE_SOCKET_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
