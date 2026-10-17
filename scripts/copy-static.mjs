import { cp, copyFile, mkdir } from 'node:fs/promises';
await mkdir('dist', {recursive: true});
await copyFile('index.html', 'dist/index.html');
await copyFile('src/app.css', 'dist/app.css');
await cp('public', 'dist', {recursive: true});
