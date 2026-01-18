import { ethers } from "ethers";

/* شبكات مدعومة */
const NETWORKS = {
  ethereum: {
    name: "Ethereum Mainnet",
    rpc: "https://cloudflare-eth.com"
  },
  base: {
    name: "Base Mainnet",
    rpc: "https://mainnet.base.org"
  },
  zora: {
    name: "Zora Mainnet",
    rpc: "https://rpc.zora.energy"
  }
};

/* فحص التفعيل */
async function activationCheck(address, networkKey = "ethereum") {
  const net = NETWORKS[networkKey];

  if (!net) {
    console.log("❌ شبكة غير مدعومة");
    return;
  }

  if (!ethers.isAddress(address)) {
    console.log("❌ عنوان غير صالح");
    return;
  }

  console.log("━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 Network: ${net.name}`);
  console.log("🔍 Activation Check:", address);

  let provider;
  try {
    provider = new ethers.JsonRpcProvider(net.rpc);
    await provider.getBlockNumber(); // test connection
  } catch (e) {
    console.log("❌ فشل الاتصال بالشبكة");
    console.log("ℹ️ السبب:", e.shortMessage || e.message);
    return;
  }

  try {
    const [balanceWei, txCount, code] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address),
      provider.getCode(address)
    ]);

    const balance = Number(ethers.formatEther(balanceWei));
    const isContract = code !== "0x";

    console.log("━━━━━━━━━━━━━━━━━━━━");
    console.log("💰 ETH Balance:", balance);
    console.log("🔁 Transactions:", txCount);
    console.log("📜 Contract:", isContract ? "YES" : "NO");

    console.log("━━━━━━━━━━━━━━━━━━━━");

    const activated =
      balance > 0 ||
      txCount > 0 ||
      isContract;

    if (activated) {
      console.log("✅ STATUS: ACTIVATED");
      console.log("🟢 العنوان مُفعَّل on-chain");
    } else {
      console.log("⚠️ STATUS: NOT ACTIVATED");
      console.log("🟡 العنوان موجود لكن غير مستخدم");
    }

  } catch (err) {
    console.log("❌ خطأ أثناء الفحص");
    console.log(err.message);
  }
}

/* CLI */
const address = process.argv[2];
const network = process.argv[3] || "ethereum";

if (!address) {
  console.log("❗ الاستخدام:");
  console.log("node activate-check.js 0xYourAddress [ethereum|base|zora]");
  process.exit(1);
}

activationCheck(address, network);

