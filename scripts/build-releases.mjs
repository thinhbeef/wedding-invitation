import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releasesRoot = path.join(root, '.deploy-releases');
const teamId = 'team_uh7xr6bwJailuijZ7acejJRu';
const targets = [
  { side: 'groom', name: 'minh-chung-mot-nha', id: 'prj_UJ6A1UBOBTY66PaHPXpaPn6u6rmy' },
  { side: 'bride', name: 'nhu-y-ngoc-thinh', id: 'prj_mT8oBt4PXsYIQVANsgoEpDJ0mbwj' },
];

function brideHtml(html, route = '', displayTime = '') {
  const title = 'Thiệp mời lễ vu quy · Như Ý &amp; Ngọc Thịnh · 05.12.2026' + (displayTime ? ' · ' + displayTime : '');
  const canonical = 'https://nhu-y-ngoc-thinh.vercel.app' + (route || '/');
  return html
    .replaceAll('lễ tân hôn', 'lễ vu quy')
    .replaceAll('Ngọc Thịnh và Như Ý', 'Như Ý và Ngọc Thịnh')
    .replaceAll('https://minh-chung-mot-nha.vercel.app', 'https://nhu-y-ngoc-thinh.vercel.app')
    .replace(/<title>.*?<\/title>/, '<title>' + title + '</title>')
    .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + title + '$2')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + canonical + '$2')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + canonical + '$2');
}

for (const target of targets) {
  const directory = path.join(releasesRoot, target.side);
  const output = path.join(directory, '.vercel', 'output');
  const staticDirectory = path.join(output, 'static');
  // Vite may empty only this generated directory, always inside the workspace.
  if (!staticDirectory.startsWith(releasesRoot + path.sep)) throw new Error('Invalid build directory');
  await mkdir(output, { recursive: true });
  await build({
    root,
    base: '/',
    logLevel: 'warn',
    define: { 'import.meta.env.VITE_INVITATION_SIDE': JSON.stringify(target.side) },
    build: { outDir: staticDirectory, emptyOutDir: true },
  });
  const routes = [];
  if (target.side === 'bride') {
    const html = await readFile(path.join(staticDirectory, 'index.html'), 'utf8');
    await writeFile(path.join(staticDirectory, 'index.html'), brideHtml(html));
    for (const [route, label] of [['/10h30-trua', '10h30 trưa'], ['/16h', '16h chiều']]) {
      const routeDirectory = path.join(staticDirectory, route.slice(1));
      await mkdir(routeDirectory, { recursive: true });
      await writeFile(path.join(routeDirectory, 'index.html'), brideHtml(html, route, label));
      routes.push({ src: route + '/?', dest: route + '/index.html' });
    }
  }
  routes.push({ handle: 'filesystem' }, { src: '/.*', dest: '/index.html' });
  await writeFile(path.join(output, 'config.json'), JSON.stringify({ version: 3, routes }, null, 2));
  await writeFile(path.join(directory, '.vercel', 'project.json'), JSON.stringify({
    projectId: target.id, orgId: teamId, projectName: target.name,
  }, null, 2));
  // Build artifacts only; this script never publishes or pushes.
  console.log(target.name + ': ' + path.relative(root, directory));
}
