pragma solidity ^0.4.19;

contract ChainRegistry {

    struct Chain {
        address owner;
        string bootNodes;
        string meta;
        address registryContract;
        bytes32 contractChain;
    }

    mapping (bytes32 => Chain) public chains;

    event LogChainRegistered(bytes32 indexed chain);

    function registerChain(bytes32 chain, string bootNodes, string meta, address registryContract, bytes32 contractChain) public {
        var data = chains[chain];
        require(data.owner==0x0 || data.owner==msg.sender);
        data.bootNodes = bootNodes;
        data.owner = msg.sender;
        data.registryContract = registryContract;
        data.contractChain = contractChain;
        data.meta=meta;
        LogChainRegistered(chain);
    }
    

}