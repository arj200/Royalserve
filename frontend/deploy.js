#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Royalserve Frontend Deployment...');
console.log('📍 Frontend will be accessible at: http://34.28.133.216:3000/');

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
  console.log('🏗️ Building for production...');
  
  // Build the project
  const build = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  build.on('close', (buildCode) => {
    if (buildCode !== 0) {
      console.error('❌ Build failed');
      process.exit(1);
    }
    
    console.log('✅ Build completed successfully');
    console.log('🏃 Starting development server...');
    
    // Start the development server
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });
    
    server.on('close', (code) => {
      console.log(`Frontend server exited with code ${code}`);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});