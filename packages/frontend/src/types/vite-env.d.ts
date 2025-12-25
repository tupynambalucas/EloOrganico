/// <reference types="react" />

/* [CORREÇÃO CRÍTICA]
  Removemos 'vite-plugin-svgr/client' pois ele traz o 'vite/client' 
  transistivamente, o que reativava o wildcard do CSS e impedia o erro de arquivo não encontrado.
*/

/* --- IMAGENS E ASSETS --- */
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.ico' {
  const src: string;
  export default src;
}
declare module '*.bmp' {
  const src: string;
  export default src;
}

/* --- SVG (Configuração Manual para substituir o plugin) --- */
// Para imports como: import Logo from './logo.svg?react'
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

// Para imports como: import iconUrl from './icon.svg'
declare module '*.svg' {
  const src: string;
  export default src;
}

/* --- VARIÁVEIS DE AMBIENTE --- */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    readonly data: any;
    accept(): void;
    accept(cb: (mod: any) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
    accept(deps: readonly string[], cb: (mods: any[]) => void): void;
    prune(cb: () => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
  };
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}