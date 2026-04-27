/**
 * Root-level entry point for the IdleWheels server.
 * This file spawns the actual server logic located in the /server directory
 * to ensure the correct working directory and environment.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server');

console.log('--- IdleWheels Server Bootloader ---');
console.log(`Working Directory: ${serverPath}`);

const child = spawn('node', ['server.js'], {
  cwd: serverPath,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\nServer process exited with code ${code}`);
  }
});

child.on('error', (err) => {
  console.error('\nFailed to start server:', err);
});
