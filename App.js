import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, Button, StyleSheet } from "react-native";
import Web3Auth from "@web3auth/react-native-sdk";
import { ethers } from "ethers";

export default function App() {
  const [account, setAccount] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);

  const clientId = "BDl23vVfo6S....._NI5S7AVcI"; // Web3Auth Client ID
  const network = "mainnet"; // Base Mainnet
  const baseRpc = "https://mainnet.base.org"; // Public RPC Base Mainnet

  const web3auth = new Web3Auth({ clientId, network });

  const login = async () => {
    try {
      const provider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setAccount(null);
    setLatestBlock(null);
  };

  // دالة لجلب آخر بلوك
  const fetchLatestBlock = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(baseRpc);
      const blockNumber = await provider.getBlockNumber();
      setLatestBlock(blockNumber);
    } catch (err) {
      console.error("Failed to fetch latest block:", err);
    }
  };

  // تحديث آخر بلوك كل 5 ثواني
  useEffect(() => {
    fetchLatestBlock(); // أول مرة
    const interval = setInterval(fetchLatestBlock, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Web3Auth Base Monitor</Text>
      {account ? (
        <>
          <Text style={styles.info}>Address: {account}</Text>
          <Text style={styles.info}>
            Latest Block: {latestBlock !== null ? latestBlock : "Loading..."}
          </Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Button title="Login with Web3Auth" onPress={login} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  info: { fontSize: 16, marginVertical: 10 },
});

useEffect(() => {
  const initWeb3Auth = async () => {
    const w3a = new Web3Auth({ clientId, network });
    await w3a.init();
    setWeb3auth(w3a);
  };
  initWeb3Auth();

  fetchLatestBlock();
  const interval = setInterval(fetchLatestBlock, 5000);
  return () => clearInterval(interval);
}, []);
const provider = await web3auth.connect();

