const fetch = require("node-fetch");

// ضع عنوان محفظتك هنا
const WALLET_ADDRESS =0x2A5bc1c1571Bc67d23492F379cB939BD8e25Fe20


// RPC للـ Base Mainnet
const RPC_URL = "https://mainnet.base.org";

let lastTxCount = 0;

async function checkWallet() {
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getTransactionCount",
        params: [WALLET_ADDRESS, "latest"],
        id: 1
      })
    });

    const data = await response.json();
    const txCount = parseInt(data.result, 16);

    if (lastTxCount === 0) {
      console.log(`${new Date().toLocaleString()} - معاملات المحفظة: ${txCount}`);
    } else if (txCount > lastTxCount) {
      console.log(`${new Date().toLocaleString()} - تم اكتشاف معاملة جديدة! إجمالي المعاملات: ${txCount}`);
      // هنا يمكن إضافة إشعار Telegram أو Email
    }

    lastTxCount = txCount;
  } catch (err) {
    console.error("خطأ عند مراقبة المحفظة:", err);
  }
}

// فحص كل 10 ثواني
setInterval(checkWallet, 10000);
