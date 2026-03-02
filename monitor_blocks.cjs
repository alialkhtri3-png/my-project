// monitor_blocks.cjs
const fetch = require("node-fetch");
const { Web3Auth } = require("@web3auth/react-native-sdk");

// ==== إعداد Web3Auth على Mainnet ====
const web3auth = new Web3Auth({
  clientId: "<YOUR_MAINNET_CLIENT_ID>",
  network: "mainnet"
});

// ==== وظيفة مراقبة آخر بلوك ====
let previousBlock = 0;

async function checkBlock() {
  try {
    const response = await fetch("https://mainnet.base.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1
      })
    });

    const data = await response.json();
    const blockHex = data.result;
    const blockDec = parseInt(blockHex, 16);
    const diff = previousBlock === 0 ? 0 : blockDec - previousBlock;

    console.log(`${new Date().toLocaleString()} - Last Block: ${blockDec} (+${diff})`);

    previousBlock = blockDec;

  } catch (err) {
    console.error("Error fetching block:", err);
  }
}

// ==== تشغيل المراقبة كل 5 ثواني ====
setInterval(checkBlock, 5000);

