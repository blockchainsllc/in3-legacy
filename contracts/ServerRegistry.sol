pragma solidity ^0.4.19;

contract ServerRegistry {

    event LogServerRegistered(string url, uint props, address owner, uint deposit);
    event LogServerUnregistered(string url, address owner);
    event LogServerConvicted(string url, address owner);
    event LogServerRemoved(string url, address owner);

    struct Web3Server {
        string url;
        address owner;
        uint deposit;
        uint props;
        uint unregisterRequestTime;

    }
    
    Web3Server[] public servers;

    function totalServers() public constant returns (uint)  {
        return servers.length;
    }
    
    function registerServer(string _url, uint _props) public payable {
        Web3Server memory m;
        m.url = _url;
        m.props = _props;
        m.owner = msg.sender;
        m.deposit = msg.value;
        servers.push(m);
        LogServerRegistered(_url, _props, msg.sender,msg.value);
    }
    
    function startUnregisteringServer(uint _serverIndex) public {
        require(servers[_serverIndex].owner == msg.sender);
        servers[_serverIndex].unregisterRequestTime = now;
        LogServerUnregistered(servers[_serverIndex].url, servers[_serverIndex].owner );
    }
    
    function unregisterServer(uint _serverIndex) public {
        require(servers[_serverIndex].owner == msg.sender && servers[_serverIndex].unregisterRequestTime + 1 hours < now);
        msg.sender.transfer(servers[_serverIndex].deposit);
        removeServer(_serverIndex);
    }
    
    function convict(uint _serverIndex, bytes32 _blockhash, uint _blocknumber, uint8 _v, bytes32 _r, bytes32 _s) public {
        // verify _blockhash
        require(block.blockhash(_blocknumber) != _blockhash);
        require(ecrecover(keccak256(_blockhash, _blocknumber), _v, _r, _s) == servers[_serverIndex].owner);
        msg.sender.transfer(servers[_serverIndex].deposit);
        LogServerConvicted(servers[_serverIndex].url, servers[_serverIndex].owner );
        removeServer(_serverIndex);

    }
    
    // internal helpers
    
    function removeServer(uint _serverIndex) internal {
        LogServerRemoved(servers[_serverIndex].url, servers[_serverIndex].owner );
        uint length = servers.length;
        Web3Server memory m = servers[length - 1];
        servers[_serverIndex] = m;
        servers.length--;
    }
}