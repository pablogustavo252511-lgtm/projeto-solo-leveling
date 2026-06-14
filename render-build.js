const { spawnSync } = require("child_process");
const { findBackendDir } = require("./render-paths");

const backendDir = findBackendDir();
console.log(`Render build usando backend em: ${backendDir}`);

const result = spawnSync("npm", ["install"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true
});

process.exit(result.status || 0);

