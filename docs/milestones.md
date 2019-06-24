# Roadmap

Incubed implements 2 Versions. 
 - **Typescript / Javascript** , which is optimized for dapps, webapps or mobile apps.
 - **embedded C** optimized for microcontrollers and all other use cases.  

## V1.2 Stable - Q3 2019

The first stable release, which was published after devcon. It contains full verification of all relevant ethereum rpc-calls (except eth_call for eWasm-Contracts), but no payment or incentivisation included yet.

- **Failsafe Connection** - The Incubed client will connect to any ethereum-blockchain (providing in3-servers) by randomly selecting nodes within the Incubed-network and automatically retry with different nodes, if the node cannot be reached or delivers verifiable responses.
- **Reputation Management** - Nodes which are not available will be automatically temporarily blacklisted and loose repuatation. The selection of a node is based on the weight (or performance) of the node and its availability. 
- **Automatic Nodelist Updates** - All Incubed nodes are registered in smart contracts onchain and will trigger events if the nodelist changes. Each request will always return the blocknumber of the last event, so the client knows when to update its nodelist.
- **Partial Nodelist** - In order to support small devices, the nodelist can be limited and still be fully verfied by basing the selection of nodes deterministically on a client-generated seed.
- **MultiChain Support** - Incubed is currently supporting any ethereum-based chain. The client can even run parallel requests to different networks without the need to synchronize first.
- **Preconfigured Boot Nodes** - While you can configure any registry contract, the standard version contains configuration with boot nodes for `mainnet`, `kovan`, `evan`, `tobalaba` and `ipfs`.
- **Full Verification of JSON-RPC-Methods** - Incubed is able to fully verify all important JSPN-RPC-Methods. This even includes calling functions in smart contract and verifying their return value (`eth_call`), which means executing each opcode locally in the client in order to confirm the result.  
- **IPFS-Support** - Incubed is able to write and read IPFS-content and verify the data by hashing and creating the the multihash.
- **Caching Support** - an optional cache allows to store the result of rpc-requests and automatically use it again within a configurable time span or if the client if offline. This also includes RPC-Requests, blocks, code and nodelists)
- **Custom Configuration** - The client is highly customizable. For each single request a configuration can be explicitly passed or by adjusting it through events (`client.on('beforeRequest',...)`). This allows  to optimize proof-level or number of requests to be sent depending on the context.
- **Proof-Levels** Incubed supports different proof-levels: `none` -  for no verifiaction, `standard` - for verifying only relevant properties and  `full` - for complete vertification including uncle blocks or previous Transaction (higher payload) )
- **Security-Levels** - configurable number of signatures (for PoW) and minimal deposit stored.
- **PoW-Support** - For PoW blocks are verified based on blockhashes signed by Incubed nodes storing a deposit which they lose if this blockhash is not correct.
- **PoA-Support** - For PoA-Chains (using Aura) blockhashes are verified by extracting the signature from the sealed fields of the blockheader and by using the aura-algorithm to determine the signer from the Validatorlist (with static Validatorlist or contract based validators) 
- **Finality-Support** - For PoA-Chains the client can require a configurable number of signatures (in percent) to accept them as final.
- **Flexible Transport-layer** - The communication-layer between clients and nodes can be overridden, but already support different transport formats (json/cbor/in3)
- **Replace Latest-Blocks** - Since most applications per default always ask request for the latest block, which cannot be considered as final in a PoW-Chain, a configuration allows to automatically use a certain blockheight to run the request. (like 6 blocks)
- **Light Ethereum API** - Incubed comes with a typesafe simple API, which covers all standard JSON-RPC-Requests ( `in3.eth.getBalance('0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5')` ). This API also includes support for signing and sending transactions as well as calling methods in smart contracts without a complete ABI by simply passing the signature of the method as argument.
- **TypeScript Support** - as Incubed is written 100% in typescript, you get all the advantages of a typesafe tollchain.
- **Integrations** -  Incubed has been succesfully tested in all major browsers, nodejs and even react-native.

## V1.2 Incentivisation - Q3 2019

This release will introduce the Incentivisation-Layer, which should help provide more nodes to create the decentralized Network. 

- **PoA Clique** - Support Clique PoA to verify Blockheader.
- **Signed Requests** - Incubed supports the Incentivisation-Layer which requires signed requests in order to assign client requests to certain nodes.
- **Network-Balancing** - Nodes will balance the Network based on Load and Reputation.

## V1.3 eWasm - Q1 2020

For `eth_call`-Verification the client and server must be able to execute the code. This release adds the ability to also 

- **eWasm** - Support eWasm Contracts in eth_casll.

## V1.4 Substrate - Q3 2020

Supporting Polkadot or any Substrate-based chains.

- **Substrate** - Framework support
- **Runtime-Optimization** - Using pre-compiled Runtimes. 

## V1.5 Services - Q1 2021

Generic Interface for any deterministic Service (as docker-container) to be decentralized and verified.



