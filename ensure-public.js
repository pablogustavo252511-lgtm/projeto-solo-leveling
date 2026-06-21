const fs = require("fs");
const path = require("path");

const backendDir = path.join(__dirname, "..");
const publicDir = path.join(backendDir, "public");
const sourceCandidates = [
  path.join(backendDir, "..", "frontend"),
  path.join(backendDir, "..", "..", "frontend"),
  path.join(backendDir, "..", "..", "solo-leveling-system", "frontend")
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

const sourceDir = sourceCandidates.find((candidate) => fs.existsSync(path.join(candidate, "page.html")));

if (sourceDir) {
  copyRecursive(sourceDir, publicDir);
  console.log(`Frontend copiado para public a partir de: ${sourceDir}`);
} else {
  console.log("Frontend fonte nao encontrado; usando public existente ou fallback do servidor.");
}

