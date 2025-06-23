import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      ['react-define-as-custom-element'.split('/').reverse()[0]]: './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'esnext'
  }
]);
