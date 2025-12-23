import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // TODO: Need to load react from global.
    entry: {
      'react-define-as-custom-element.production.min': './src/index.ts'
    },
    format: ['iife'],
    minify: true,
    sourcemap: true,
    target: 'esnext'
  },
  {
    entry: {
      'react-define-as-custom-element.development': './src/index.ts'
    },
    format: ['iife'],
    minify: false,
    sourcemap: true,
    target: 'esnext'
  },
  {
    dts: true,
    entry: {
      'react-define-as-custom-element': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'esnext'
  }
]);
