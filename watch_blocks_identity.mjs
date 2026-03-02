#!/usr/bin/env node
/**
 * watch_blocks_identity.js
 * يراقب آخر البلوكات على Base Mainnet ويستخرج ملفات الهوية JSON عند كل بلوك جديد
 */

import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";

// مجلد مشاريعك
const PROJECTS_DIR = `${process.env.HOME}/metamask-snap-test`;
const OUTPUT_DIR = `${process.env.HOME}/identity-json-compiled`;

// آخر بلوك تمت معالجته
let lastBlock = 0;

// دالة للحصول على آخر بلوك من Base Mainnet
async function getLatestBlock() {
  try {
    const res = await fetch("https://mainnet.base.org", { method: "POST" });
    const text = await res.text();
    const block = parseInt(text.trim());
    return block;
  } catch (err) {
    console.error("❌ خطأ في جلب البلوك:", err.message);
    return lastBlock;
  }
}

// دالة استخراج ملفات الهوية JSON لكل مشروع
function extractIdentityJSON() {
  console.log("📋 استخراج ملفات الهوية JSON...");
  exec(`~/metamask-snap-test/compile-base-identity-json-v4.sh ${PROJECTS_DIR}`, (err, stdout, stderr) => {
    if (err) console.error("❌ خطأ في السكربت:", err.message);
    if (stderr) console.error(stderr);
    console.log(stdout);
  });
}

// المراقبة كل 5 ثواني
async function monitorBlocks() {
  const block = await getLatestBlock();
  if (block > lastBlock) {
    console.log(`🟢 بلوك جديد: ${block} (آخر بلوك: ${lastBlock})`);
    lastBlock = block;
    extractIdentityJSON();
  } else {
    console.log(`⏳ لا بلوك جديد (آخر بلوك: ${lastBlock})`);
  }
  setTimeout(monitorBlocks, 5000); // كل 5 ثواني
}

// بدء المراقبة
console.log("🚀 بدء مراقبة البلوكات على Base Mainnet...");
monitorBlocks();

