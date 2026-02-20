const { spawn } = require('child_process');

// We simply want to test test/tool/registry.test.ts without vite or bun test polluting the env
const child = spawn("bun", ["test", "test/tool/registry.test.ts"], {
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'test', BUN_ENV: 'test' },
  stdio: 'inherit'
});

child.on('close', (code) => {
  process.exit(code);
});
