// Uniswap contract addresses
WETH_ADDRESS= '0x5FbDB2315678afecb367f032d93F642f64180aa3'
FACTORY_ADDRESS= '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
SWAP_ROUTER_ADDRESS= '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
NFT_DESCRIPTOR_ADDRESS= '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
POSITION_DESCRIPTOR_ADDRESS= '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
POSITION_MANAGER_ADDRESS= '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

// Pool addresses
USDT_USDC_500= '0x1FA8DDa81477A5b6FA1b2e149e93ed9C7928992F'
USDT_USDC_3000= '0x3B00F82071576B8489A6e3df223dcC0e937841d1'
USDT_USDC_10000= '0xb09EB46A30889ae3cE4AFa5d8ebD136B4f389B85'

// Token addresses
TETHER_ADDRESS= '0x0165878A594ca255338adfa4d48449f69242Eb8F'
USDC_ADDRESS= '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Usdt: require("../artifacts/contracts/Tether.sol/Tether.json"),
  Usdc: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers")
const { Token } = require('@uniswap/sdk-core')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}

LIQUIDITY = ethers.utils.parseEther('100')
DEADLINE = Math.floor(Date.now() / 1000) + (60 * 10)
POOL_ADDRESSES = [USDT_USDC_500, USDT_USDC_3000, USDT_USDC_10000] // ,


async function main() {
  const [owner, signer2] = await ethers.getSigners();
  const provider = waffle.provider;

  const nonfungiblePositionManager = new Contract(
    POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    provider
  )
  const usdtContract = new Contract(TETHER_ADDRESS,artifacts.Usdt.abi,provider)
  const usdcContract = new Contract(USDC_ADDRESS,artifacts.Usdc.abi,provider)

  await usdtContract.connect(owner).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('9999999'))
  await usdcContract.connect(owner).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('9999999'))

  const UsdtToken = new Token(31337, TETHER_ADDRESS, 18, 'USDT', 'Tether')
  const UsdcToken = new Token(31337, USDC_ADDRESS, 18, 'USDC', 'UsdCoin')

  const poolContract1 = new Contract(USDT_USDC_500, artifacts.UniswapV3Pool.abi, provider)
  const poolContract2 = new Contract(USDT_USDC_3000, artifacts.UniswapV3Pool.abi, provider)
  const poolContract3 = new Contract(USDT_USDC_10000, artifacts.UniswapV3Pool.abi, provider)

  const poolData = {}
  poolData[USDT_USDC_500] = await getPoolData(poolContract1)
  poolData[USDT_USDC_3000] = await getPoolData(poolContract2)
  poolData[USDT_USDC_10000] = await getPoolData(poolContract3)

  // appears I cannot interact with contracts in the async map
  const mintParams = {}
  POOL_ADDRESSES.map(async poolAddress => {
    pd = poolData[poolAddress]

    const poolObj = new Pool(
      UsdtToken,
      UsdcToken,
      pd.fee,
      pd.sqrtPriceX96.toString(),
      pd.liquidity.toString(),
      pd.tick
    )

    const tickLower = nearestUsableTick(pd.tick, pd.tickSpacing) - pd.tickSpacing * 100
    const tickUpper = nearestUsableTick(pd.tick, pd.tickSpacing) + pd.tickSpacing * 100

    const positionObj = new Position({
      pool: poolObj,
      liquidity: LIQUIDITY,
      tickLower: tickLower,
      tickUpper: tickUpper,
    })

    const { amount0: amount0Desired, amount1: amount1Desired} = positionObj.mintAmounts
    const params = {
      token0: TETHER_ADDRESS,
      token1: USDC_ADDRESS,
      fee: pd.fee,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Desired: amount0Desired.toString(),
      amount1Desired: amount1Desired.toString(),
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer2.address,
      deadline: DEADLINE
    }

    mintParams[poolAddress] = params
  })

  const tx1 = await nonfungiblePositionManager.connect(owner).mint(mintParams[USDT_USDC_500], { gasLimit: '1000000' })
  await tx1.wait()

  const tx2 = await nonfungiblePositionManager.connect(owner).mint(mintParams[USDT_USDC_3000], { gasLimit: '1000000' })
  await tx2.wait()

  const tx3 = await nonfungiblePositionManager.connect(owner).mint(mintParams[USDT_USDC_10000], { gasLimit: '1000000' })
  await tx3.wait()
  console.log('done')
}

/*
npx hardhat run --network localhost scripts/04_addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });