import { startApp } from './app.js';
startApp().catch(err => { const root = document.getElementById('app'); if (root) {
    root.textContent = 'Unable to open the evidence workbench: ' + String(err);
    root.setAttribute('role', 'alert');
} });
