#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Royalserve Backend Deployment...');
console.log('📍 Backend will be accessible at: http://34.28.133.216:8888/');

// Install dependencies
console.log('📦 Installing dependencies...');
const install = spawn('npm', ['install'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

install.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  console.log('✅ Dependencies installed successfully');
  console.log('🏃 Starting server...');
  
  // Start the server
  const server = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});