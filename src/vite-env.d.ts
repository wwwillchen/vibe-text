
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add process.env for compatibility
declare global {
  interface Window {
    process?: {
      env: {
        VITE_OPENAI_API_KEY?: string;
      };
    };
  }
}
