import { ethers } from "ethers";

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

  const provider = new ethers.JsonRpcProvider(net.rpc);

  try {
    await provider.getBlockNumber();
  } catch {
    console.log("❌ فشل الاتصال بالشبكة");
    return;
  }

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

  if (balance > 0 || txCount > 0 || isContract) {
    console.log("✅ STATUS: ACTIVATED");
  } else {
    console.log("⚠️ STATUS: NOT ACTIVATED");
  }
}

const address = process.argv[2];
const network = process.argv[3] || "ethereum";

if (!address) {
  console.log("node activate-check.js 0xAddress [ethereum|base|zora]");
  process.exit(1);
}

activationCheck(address, network);

