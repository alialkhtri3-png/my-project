const { ethers } = require('ethers');

module.exports.onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {

    case 'keyring_listAccounts':
      // يمكنك استبدال هذه القيم بحسابات حقيقية من MetaMask
      return [
        { id: '1', address: '0x1111111111111111111111111111111111111111' },
        { id: '2', address: '0x2222222222222222222222222222222222222222' }
      ];

    case 'getBalance':
      if (!request.params || !request.params.address) {
        throw new Error('يرجى تمرير عنوان "address" في params');
      }
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [request.params.address, 'latest'],
      });
      return ethers.utils.formatEther(balance);

    case 'signMessage':
      if (!request.params || !request.params.message) {
        throw new Error('يرجى تمرير "message" في params');
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      return await ethereum.request({
        method: 'personal_sign',
        params: [request.params.message, accounts[0]],
      });

    case 'sendTransaction':
      if (!request.params || !request.params.to || !request.params.value) {
        throw new Error('يرجى تمرير "to" و "value" في params');
      }
      const fromAccounts = await ethereum.request({ method: 'eth_accounts' });
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAccounts[0],
          to: request.params.to,
          value: ethers.utils.parseEther(request.params.value).toHexString(),
        }],
      });
      return txHash;

    default:
      throw new Error(`Method غير معروف: ${request.method}`);
  }
};


