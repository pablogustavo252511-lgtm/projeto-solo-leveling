const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();

const backendCandidates = [
  path.join(rootDir, "solo-leveling-system", "backend"),
  path.join(rootDir, "backend"),
  rootDir
];

const frontendCandidates = [
  path.join(rootDir, "solo-leveling-system", "frontend"),
  path.join(rootDir, "frontend"),
  path.join(rootDir, "..", "frontend")
];

function copyRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

const backendDir = backendCandidates.find((candidate) => fs.existsSync(path.join(candidate, "server.js")));
const frontendDir = frontendCandidates.find((candidate) => fs.existsSync(path.join(candidate, "page.html")));

if (!backendDir) {
  console.log("Backend nao encontrado; pulando sincronizacao do frontend.");
  process.exit(0);
}

if (!frontendDir) {
  console.log("Frontend fonte nao encontrado; usando public existente ou fallback do servidor.");
  process.exit(0);
}

const publicDir = path.join(backendDir, "public");
copyRecursive(frontendDir, publicDir);
console.log(`Frontend copiado para ${publicDir}`);

