#!/usr/bin/env node
// watch_and_compile_identity.mjs
import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";
import path from "path";

const ROOT_DIR = process.argv[2] || process.env.HOME + "/metamask-snap-test";
const OUTPUT_ROOT = process.env.HOME + "/identity-json-compiled";
const POLL_INTERVAL = 5000; // كل 5 ثواني
let lastBlock = 0;

fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

console.log("🚀 بدء مراقبة البلوكات على Base Mainnet...");
console.log(`📁 مجلد المشاريع: ${ROOT_DIR}`);
console.log(`📁 مجلد الإخراج: ${OUTPUT_ROOT}`);

async function getLatestBlock() {
  try {
    const res = await fetch("https://mainnet.base.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1
      })
    });
    const data = await res.json();
    return parseInt(data.result, 16);
  } catch (err) {
    console.error("❌ خطأ في الحصول على آخر بلوك:", err.message);
    return lastBlock;
  }
}

function copyJSONFiles(projectDir) {
  const outputDir = path.join(OUTPUT_ROOT, path.basename(projectDir));
  fs.mkdirSync(outputDir, { recursive: true });

  const files = [];
  function walk(dir) {
    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory() && file.name !== "node_modules") {
        walk(fullPath);
      } else if (file.isFile() && ["identity.json","nft-metadata.json","onchain-config.json"].includes(file.name)) {
        const rel = path.relative(projectDir, fullPath);
        const target = path.join(outputDir, rel);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(fullPath, target);
        files.push(rel);
      }
    }
  }
  walk(projectDir);

  if (files.length > 0) {
    const timestamp = new Date().toISOString().replace(/[:.]/g,"_");
    const zipFile = `${outputDir}_${timestamp}.zip`;
    const tarFile = `${outputDir}_${timestamp}.tar.gz`;
    exec(`cd "${OUTPUT_ROOT}" && zip -r "${zipFile}" "${path.basename(projectDir)}" > /dev/null`);
    exec(`cd "${OUTPUT_ROOT}" && tar -czf "${tarFile}" "${path.basename(projectDir)}" > /dev/null`);
    console.log(`🗜️ ضغط الملفات: ${zipFile}, ${tarFile}`);
  }
}

async function poll() {
  const latest = await getLatestBlock();
  if (latest > lastBlock) {
    console.log(`✅ بلوك جديد: ${latest} (آخر بلوك: ${lastBlock})`);
    lastBlock = latest;

    // معالجة كل مشروع Web3
    const projects = fs.readdirSync(ROOT_DIR, { withFileTypes: true })
                       .filter(d => d.isDirectory())
                       .map(d => path.join(ROOT_DIR, d.name));

    for (const proj of projects) {
      const pkgFile = path.join(proj, "package.json");
      if (fs.existsSync(pkgFile)) {
        copyJSONFiles(proj);
      }
    }
  } else {
    process.stdout.write(`⏳ لا بلوك جديد (آخر بلوك: ${lastBlock})\r`);
  }
  setTimeout(poll, POLL_INTERVAL);
}

poll();

if (files.length > 0) {
  console.log(`📋 نسخ ملفات الهوية من ${path.basename(projectDir)}:`);
  files.forEach(f => console.log(`  - ${f}`));

  const timestamp = new Date().toISOString().replace(/[:.]/g,"_");
  const zipFile = `${outputDir}_${timestamp}.zip`;
  const tarFile = `${outputDir}_${timestamp}.tar.gz`;
  exec(`cd "${OUTPUT_ROOT}" && zip -r "${zipFile}" "${path.basename(projectDir)}" > /dev/null`);
  exec(`cd "${OUTPUT_ROOT}" && tar -czf "${tarFile}" "${path.basename(projectDir)}" > /dev/null`);
  console.log(`🗜️ ضغط الملفات: ${zipFile}, ${tarFile}`);
}

