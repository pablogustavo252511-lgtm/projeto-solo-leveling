const { spawn } = require("child_process");
const { findBackendDir } = require("./render-paths");

const backendDir = findBackendDir();
console.log(`Render start usando backend em: ${backendDir}`);

const child = spawn("node", ["server.js"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  process.exit(code || 0);
});

