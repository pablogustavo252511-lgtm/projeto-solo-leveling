const { spawnSync } = require("child_process");
const { findBackendDir } = require("./render-paths");

const backendDir = findBackendDir();
console.log(`Render build usando backend em: ${backendDir}`);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: backendDir,
    stdio: "inherit",
    shell: true
  });

  if (result.status) {
    process.exit(result.status);
  }
}

run("npm", ["install"]);
run("npx", ["prisma", "generate", "--schema", "prisma/schema.prisma"]);

if (process.env.USE_LOCAL_DB !== "true" && process.env.DATABASE_URL) {
  run("npx", ["prisma", "db", "push", "--schema", "prisma/schema.prisma"]);
  run("npm", ["run", "db:migrate-json"]);
}
