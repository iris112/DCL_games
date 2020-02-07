pragma solidity ^0.4.25;

contract ERC20Token {
    function transferFrom(address from, address to, uint256 tokens)
        public
        returns (bool success);
    function balanceOf(address to) public returns (uint256 balance);
    function transfer(address to, uint256 tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 tokens);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );
}
