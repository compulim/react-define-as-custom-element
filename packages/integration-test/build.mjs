// eslint-disable-next-line import/no-namespace
import * as esbuild from 'esbuild';
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';

const rootPath = resolve(fileURLToPath(import.meta.url), '../webDriver');
const paths = await readdir(rootPath);

for (const path of paths) {
  const fullPath = resolve(rootPath, path);

  if (fullPath.endsWith('static') || !(await stat(fullPath)).isDirectory()) {
    continue;
  }

  await esbuild.build({
    bundle: true,
    entryPoints: {
      [resolve(fullPath, './dist/index')]: resolve(fullPath, './index.jsx')
    },
    jsx: 'automatic',
    outdir: '.',
    sourcemap: 'external',
    target: 'esnext'
  });

  console.log(`Test "${path}" built.`);
}
