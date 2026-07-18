const fs = require("fs");
const path = require("path");

function findBackendDir() {
  const candidates = [
    path.join(process.cwd(), "solo-leveling-system", "backend"),
    path.join(process.cwd(), "backend"),
    process.cwd()
  ];

  const backendDir = candidates.find((candidate) => {
    return fs.existsSync(path.join(candidate, "server.js"))
      && fs.existsSync(path.join(candidate, "package.json"));
  });

  if (!backendDir) {
    throw new Error(`Backend nao encontrado. Pasta atual: ${process.cwd()}`);
  }

  return backendDir;
}

module.exports = { findBackendDir };

