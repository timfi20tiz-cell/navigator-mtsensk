import { execSync, spawn } from 'child_process';
import fs from 'node:fs';

const cwd = 'C:/Projects/autoservice-sites';

// Remove any test files first
['verify_logo_site.mjs'].forEach(f => {
  const p = cwd + '/' + f;
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

try {
  execSync('git init -b main', { cwd });
  execSync('git config user.name "timfi20tiz-cell"', { cwd });
  execSync('git config user.email "timfi20tiz@gmail.com"', { cwd });
  execSync('git add .', { cwd });
  execSync('git commit -m "feat: complete production website for Navigator auto repair Mtsensk"', { cwd });
  
  // check remote
  try {
    execSync('git remote add origin https://github.com/timfi20tiz-cell/navigator-mtsensk.git', { cwd });
  } catch (e) {
    execSync('git remote set-url origin https://github.com/timfi20tiz-cell/navigator-mtsensk.git', { cwd });
  }

  const pushOut = execSync('git push -u origin main --force', { cwd, encoding: 'utf8' });
  console.log('Push success:', pushOut);

  // Enable GitHub Pages via API
  const proc = spawn('git', ['credential', 'fill']);
  proc.stdin.write('protocol=https\nhost=github.com\n\n');
  let credOut = '';
  proc.stdout.on('data', d => credOut += d);
  proc.on('close', async () => {
    const tokenLine = credOut.split('\n').find(l => l.startsWith('password='));
    if (!tokenLine) {
      console.log('No token found for pages enable');
      return;
    }
    const token = tokenLine.substring(9).trim();
    const res = await fetch('https://api.github.com/repos/timfi20tiz-cell/navigator-mtsensk/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'NodeJS',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      })
    });
    console.log('GitHub Pages enable status:', res.status);
    const data = await res.json();
    console.log('Pages URL:', data.html_url || data.message);
  });

} catch (err) {
  console.error('Deploy error:', err);
}
