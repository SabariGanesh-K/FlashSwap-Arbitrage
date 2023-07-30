# Execute FlashSwap using Uniswap V3

Perform a Flashloan in a pool , and use the funds to make swaps on other pools as Arbitrage to gain profit.

⚠️ Code is not Audited and yet to be tested extensively.

## Installation Instruction
```code
npm install
```

## Execution Instructions
After installing all dependencies involving hardhat,ethers,waffle,etc
Follow steps below:-

# Start a localhost node
```code
npx hardhat node
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/8bcfd115-4e72-4182-a082-bba78bcbc4de)

# Paralelly open a new terminal and  Start executing scripts

# 01_deploy.js
```code
 npx hardhat run --network localhost .\scripts\01_deploy.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/672b99e6-a1d0-46ec-bee8-12e71610050a)

# 02_tokenDeploy.js
```code
 npx hardhat run --network localhost .\scripts\02_tokenDeploy.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/8b1cf492-8e0f-44ed-b0c9-303cd88faa91)


# 03_PoolsDeploy.js
```code
 npx hardhat run --network localhost .\scripts\03_PoolsDeploy.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/d36cf327-a346-4824-ba50-833322b11e57)


# 04_LiquidityAddition.js
```code
 npx hardhat run --network localhost .\scripts\04_LiquidityAddition.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/68ba99e3-be58-4bdb-b8eb-26810ba736f8)

# 05_LiquidityCheck.js
```code
 npx hardhat run --network localhost .\scripts\05_LiquidityCheck.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/383703f7-c1dc-43b6-9b71-57f64bee8ab7)

# 06_FlashSwap.js
```code
 npx hardhat run --network localhost .\scripts\06_FlashSwap.js
```
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/14614db5-91a6-44f9-b3ae-deac4576eef6)

## EXPLANATION AND ALGORITHM
![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/f836b658-4fe5-47e3-b760-cb3bb949751b)

# Factory Contract :-

The Uniswap V3 Factory is a core contract in the Uniswap V3 protocol. It is responsible for creating and managing Uniswap V3 pools. The factory also provides a number of other functions, such as:
Listing pools on the Uniswap V3 exchange
Retiring pools from the exchange
Managing the protocol fees
The factory is a decentralized contract, meaning that it is not controlled by any single entity. This makes it a reliable and secure way to create and manage Uniswap V3 pools.

# SWAP ROUTER

The SwapRouter contract is a smart contract that is used to execute swaps between tokens on Uniswap V3. It is a stateless contract, which means that it does not hold any token balances. This makes it more efficient and scalable than other types of contracts.
The SwapRouter contract is used to execute swaps in two ways:
1) Direct swaps: This is the simplest way to use the SwapRouter contract. You simply specify the tokens that you want to swap, the amount of each token that you want to swap, and the slippage tolerance. The SwapRouter contract will then execute the swap and return the amount of tokens that you received.
2) Router swaps: This is a more complex way to use the SwapRouter contract. You can use router swaps to swap tokens between pools that are not directly connected. To do this, you specify the source pool, the destination pool, the amount of tokens that you want to swap, and the slippage tolerance. The SwapRouter contract will then execute the swap by first swapping your tokens to the pool token of the source pool. Then, it will swap the pool token of the source pool to the pool token of the destination pool.

# NFT token Position
The NonfungibleTokenPositionDescriptor contract is used to describe NFT token positions in Uniswap V3. It provides a way to generate a string containing the data URI for a JSON metadata string. This metadata string can be used to display information about the NFT token position, such as the token ID, the token type, and the pool address.

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/9fe1b5fb-290c-474f-9ce4-0c922fd913fa)

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/168f08ec-1890-403e-a80d-c01b61abbef8)

# TVL
TVL stands for Total Value Locked. It is a metric used to measure the amount of cryptocurrency that is deposited in a decentralized finance (DeFi) protocol. TVL is calculated by taking the sum of the value of all assets that are deposited in a protocol.
TVL is a useful metric for measuring the popularity and health of a DeFi protocol. A high TVL indicates that a large amount of value is being locked up in the protocol, which suggests that users are confident in the protocol and its ability to provide liquidity. A low TVL, on the other hand, may indicate that users are not confident in the protocol or that the protocol is not offering attractive yields.
TVL is also a useful metric for comparing different DeFi protocols. A protocol with a higher TVL is generally considered to be more popular and secure than a protocol with a lower TVL.

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/cfbf2465-25e3-4860-8876-2fa4f77ecb27)

# POSITION_MANAGER_ADDRESS
 The POSITION_MANAGER_ADDRESS in Uniswap V3 is the address of the contract that manages positions. A position is a record of the tokens that you have provided as liquidity to a Uniswap V3 pool. The position manager contract is responsible for storing the state of all positions, including the tokens that are in the position, the price range of the position, and the fees that have been earned.

 # Tick and tickspace
A tick is a unit of price in Uniswap V3. The tick spacing is the distance between two ticks.
The code first calculates the nearest usable tick to the given tick by rounding the tick down to the nearest multiple of the tick spacing. Then, it adds and subtracts 100 tick spacings from the nearest usable tick to calculate the lower and upper bounds of the nearest usable tick range.
In Uniswap V3, the nearest usable tick range is used to determine which liquidity providers are eligible to participate in a trade. Only liquidity providers who have their liquidity within the nearest usable tick range of the trade will be able to earn fees from the trade.
For example, if the given tick is 1000 and the tick spacing is 100, then the nearest usable tick range would be 900 to 1100. This means that only liquidity providers who have their liquidity within the range of 900 to 1100 will be able to earn fees from a trade that occurs at a price of 1000.

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/4ee71645-4417-49c2-ace1-a0e8ff3262df)

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/c1987633-8dcc-459b-bc8f-adc55284c7c9)

![image](https://github.com/SabariGanesh-K/FlashSwap-Arbitrage/assets/64348740/1fe84512-c53e-463b-a691-3d0964403d66)


Thank you !!

