pragma solidity ^0.4.19;

contract TestContract {

    uint public counter;

    function increase() public {
        counter = counter + 1;
    }

    

}