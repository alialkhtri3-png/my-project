// monitor_blocks.js
const fetch = require("node-fetch"); // CommonJS compatible

// رابط شبكة Base Mainnet
const RPC_URL = "https://mainnet.base.org";

// دالة لجلب آخر بلوك
async function getLatestBlock() {
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    const data = await response.json();
    const blockHex = data.result;
    const blockDec = parseInt(blockHex, 16);
    return blockDec;
  } catch (error) {
    console.error("خطأ عند جلب آخر بلوك:", error.message);
    return null;
  }
}

// مراقبة البلوكات كل 5 ثواني
async function watchBlocks() {
  let lastBlock = await getLatestBlock();
  console.log(`${new Date().toLocaleString()} - Last Block: ${lastBlock} (+0)`);

  setInterval(async () => {
    const currentBlock = await getLatestBlock();
    if (currentBlock !== null) {
      const diff = currentBlock - lastBlock;
      console.log(`${new Date().toLocaleString()} - Last Block: ${currentBlock} (+${diff})`);
      lastBlock = currentBlock;
    }
  }, 5000);
}

// تشغيل المراقبة
watchBlocks();

