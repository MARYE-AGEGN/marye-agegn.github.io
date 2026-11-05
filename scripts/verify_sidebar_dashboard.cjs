const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Marye\\.gemini\\antigravity\\brain\\61b9a01b-a81b-47c1-85dc-3af53069d68d';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (e) {}
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  console.log('Launching Chrome for Cleaned Layout Verification...');
  const tmpDir = path.join(ARTIFACTS_DIR, 'scratch', 'chrome_clean_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--window-size=1500,920',
    'about:blank',
  ]);

  try {
    await wait(2000);

    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'Runtime.enable');
    await sendCDP(ws, 'DOM.enable');

    console.log('Navigating to http://localhost:5173/#admin');
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:5173/#admin' });
    await wait(1500);

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('__dev_admin_bypass__', 'true');
        window.location.reload();
      `,
    });

    await wait(3000);

    // 1. Overview Tab
    console.log('Capturing Screenshot: 1. Clean Overview Tab');
    let shot1 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'clean_admin_1_overview.png'), Buffer.from(shot1.data, 'base64'));

    // 2. Click Settings Tab (Platform Settings)
    console.log('Navigating to Platform Settings tab...');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('.admin-nav-btn'));
          const setBtn = btns.find(b => b.textContent.includes('Platform Settings'));
          if (setBtn) setBtn.click();
        })()
      `,
    });
    await wait(1500);

    console.log('Capturing Screenshot: 2. Clean Platform Settings Tab (No duplicate words)');
    let shot2 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'clean_admin_2_settings.png'), Buffer.from(shot2.data, 'base64'));

    console.log('All screenshots captured successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
