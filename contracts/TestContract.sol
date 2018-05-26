pragma solidity ^0.4.19;

contract TestContract {

    event LogInc(uint counter, address caller);

    uint public counter;

    function increase() public {
        counter = counter + 1;
        LogInc(counter,msg.sender);
    }

    

}