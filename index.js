const { Web3Auth } = require("@web3auth/node-sdk");
const { ethers } = require("ethers");
const qrcode = require("qrcode-terminal");
const MetaMaskSDK = require("@metamask/sdk").default;

const CLIENT_ID = "BDl23vVfo6S....._NI5S7AVcI"; // ضع هنا Client ID
const RPC_URL = "https://mainnet.base.org";

(async () => {
  try {
    console.log("=== Web3Auth + MetaMask Snap ===");

    // 1️⃣ Web3Auth
    const web3auth = new Web3Auth({
      clientId: CLIENT_ID,
      network: "sapphire_devnet",
      redirectUrl: "urn:ietf:wg:oauth:2.0:oob"
    });

    const loginUrl = await web3auth.getLoginURL();
    console.log("\n📱 مسح QR Login على هاتفك:");
    qrcode.generate(loginUrl, { small: true });

    const privateKey = await web3auth.getPrivateKeyFromQR();
    const wallet = new ethers.Wallet(privateKey);
    console.log("\n🎉 تم تسجيل الدخول! عنوان المحفظة:", wallet.address);

    // 2️⃣ MetaMask SDK
    const MMSDK = new MetaMaskSDK({ openBrowser: false });
    const ethereum = MMSDK.getProvider();

    console.log("🔗 MetaMask Snap جاهز للاستخدام!");

    // 3️⃣ مزود RPC
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    console.log("\n⏱️ جلب آخر بلوكات Base كل 5 ثواني...\n");

    setInterval(async () => {
      try {
        const blockNumber = await provider.getBlockNumber();
        console.log("آخر بلوك:", blockNumber);
      } catch (err) {
        console.error("فشل في جلب البلوك:", err.message);
      }
    }, 5000);

    // 4️⃣ مثال إرسال معاملة
    // يمكنك تفعيلها بعد التأكد من وجود رصيد كافي
    // const tx = await wallet.sendTransaction({ to: "0xRecipientAddress", value: ethers.parseEther("0.001") });
    // console.log("تم إرسال المعاملة:", tx.hash);

  } catch (err) {
    console.error("خطأ:", err.message);
  }
})();

