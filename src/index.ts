import express from "express";
import cors from "cors";
import crypto from "crypto";
import { SiweMessage } from "siwe";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // لاحقًا نحدد frontend
    methods: ["GET", "POST"],
  })
);

// نخزن nonce لكل session (بسيط الآن)
const nonces = new Map<string, string>();

// 1️⃣ توليد nonce
app.get("/nonce", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");

  // للتبسيط نخزن nonce واحد
  nonces.set("global", nonce);

  res.json({ nonce });
});

// 2️⃣ التحقق من التوقيع
app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    const siwe = new SiweMessage(message);

    const storedNonce = nonces.get("global");
    if (!storedNonce) {
      return res.status(400).json({ error: "No nonce found" });
    }

    const fields = await siwe.verify({
      signature,
      nonce: storedNonce,
      domain: "localhost",
    });

    // نستهلك nonce
    nonces.delete("global");

    res.json({
      success: true,
      address: fields.data.address,
      chainId: fields.data.chainId,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, error: "Invalid signature" });
  }
});

// 🔁 غيرنا المنفذ
const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SIWE Backend running on http://localhost:${PORT}`);
});

