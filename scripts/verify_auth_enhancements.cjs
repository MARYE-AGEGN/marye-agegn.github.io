const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Marye\\.gemini\\antigravity\\brain\\61b9a01b-a81b-47c1-85dc-3af53069d68d';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;

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
  console.log('Launching Chrome for Auth Enhancements Verification...');
  const tmpDir = path.join(ARTIFACTS_DIR, 'scratch', 'chrome_auth_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--window-size=1440,900',
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
    await wait(2000);

    // 1. Initial Sign In screen with eye toggle and vibrant blue Return button
    console.log('Capturing Screenshot: 1. Sign In with Eye Toggle & Blue Return Button');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const pass = document.getElementById('admin-password');
          if (pass) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(pass, 'MySecretPass123!');
            pass.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `,
    });
    await wait(500);

    let shot1 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'auth_1_signin_eye_hidden.png'), Buffer.from(shot1.data, 'base64'));

    // 2. Click eye button to reveal password
    console.log('Clicking Eye toggle button...');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `document.querySelector('.password-toggle-btn')?.click()`,
    });
    await wait(500);

    console.log('Capturing Screenshot: 2. Password Revealed via Eye Toggle');
    let shot2 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'auth_2_password_revealed.png'), Buffer.from(shot2.data, 'base64'));

    // 3. Switch to Request Admin Access tab
    console.log('Clicking Request Admin Access tab...');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('.admin-auth-tab'));
          const reqTab = tabs.find(t => t.textContent.includes('Request Admin Access'));
          if (reqTab) reqTab.click();
        })()
      `,
    });
    await wait(500);

    console.log('Capturing Screenshot: 3. Request Admin Access Mode');
    let shot3 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'auth_3_request_admin_access.png'), Buffer.from(shot3.data, 'base64'));

    // 4. Switch to Forgot Password
    console.log('Clicking Sign In tab then Forgot Password...');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('.admin-auth-tab'));
          const signTab = tabs.find(t => t.textContent.includes('Sign In'));
          if (signTab) signTab.click();
        })()
      `,
    });
    await wait(400);

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const link = Array.from(document.querySelectorAll('.admin-auth-switch-link')).find(l => l.textContent.includes('Forgot password'));
          if (link) link.click();
        })()
      `,
    });
    await wait(500);

    console.log('Capturing Screenshot: 4. Forgot Password Screen');
    let shot4 = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'auth_4_forgot_password.png'), Buffer.from(shot4.data, 'base64'));

    console.log('All auth screenshots captured successfully!');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
