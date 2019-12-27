pragma solidity ^0.5.14;

import "./SafeMath.sol";
import "./AccessControl.sol";
import "./ERC20Token.sol";
import "./RouletteLogicInternal.sol";

contract RouleteParent is AccessControl {
    using SafeMath for uint256;

    // emit events to server node.js events handler
    event SpinResult(
        address _walletAddress,
        bytes5 _tokenSymbol,
        uint256 _landID,
        uint256 indexed _number,
        uint256 indexed _machineID,
        uint256 indexed _amountWin
    );

    event NewBalance(uint256 indexed _balance);
    event RLTChanged(RouletteLogicInternal rlt);

    uint256 public minimumBet = 0; // contract's bet price
    uint256 public funds = 0; // funds in contract
    uint256 public winAmount = 0; // last winning amount
    uint256 public number = 0; // last reels numbers
    bytes5 tokenSymbol = 'MANA'; // coin type
    uint256 public maximumBetsAmount = 25; // contract's maximum amount of bets

    ERC20Token tokenInstance = ERC20Token(
        //0xDd1B834a483fD754c8021FF0938f69C1d10dA81F // Matic/MANA
        //0x7801E36D90A2d41a35fA3fA26533E6864de9F467 // Ropsten/MOL
        0x2a8Fd99c19271F4F04B1B7b9c4f7cF264b626eDB   // Ropsten/MANA
    );

    RouletteLogicInternal public rlt;

    constructor(RouletteLogicInternal _rlt) public {
        rlt = _rlt;
        emit RLTChanged(rlt);
    }

    function changeRLT(RouletteLogicInternal _rlt) external onlyCEO {
        rlt = _rlt;
        emit RLTChanged(rlt);
    }

    function checkApproval(address _userAddress) public view whenNotPaused returns(uint approved) {
        approved = tokenInstance.allowance(_userAddress, address(this));
    }

    function bet(uint _betID, address _userAddress, uint _number, uint _value) internal whenNotPaused {
        require(_value >= minimumBet, "bet amount is less than minimum");
        rlt.createBet(_betID, _userAddress, _number, _value);
    }

    function play(
        address _userAddress,
        uint256 _landID,
        uint256 _machineID,
        uint256[] calldata _betIDs,
        uint256[] calldata _betValues,
        uint256[] calldata _betAmount,
        uint256 _localhash
    ) external whenNotPaused onlyCEO {

        require(_betIDs.length == _betValues.length, "inconsistent amount of bets/values");
        require(_betIDs.length == _betAmount.length, "inconsistent amount of bets/amount");
        require(_betIDs.length <= maximumBetsAmount, "maximum amount of bets per game is 25");

        uint256 totalTokenBet = 0;

        for (uint i = 0; i < _betIDs.length; i++) {
            totalTokenBet = totalTokenBet.add(_betAmount[i]);
        }

        //uint256 approved = checkApproval(_userAddress);
        require(tokenInstance.balanceOf(address(this)) >= totalTokenBet, "need more funds in contract"); //need to calculate maximum win amount
        require(tokenInstance.allowance(_userAddress, address(this)) >= totalTokenBet, "must approve/allow this contract as spender");

        //get user tokens if approved
        tokenInstance.transferFrom(_userAddress, address(this), totalTokenBet);

        //set bets for the game
        for (uint i = 0; i < _betIDs.length; i++) {
            bet(_betIDs[i], _userAddress, _betValues[i], _betAmount[i]);
        }

        //play game
        (winAmount, number) = rlt.launch(
            _localhash
        );

        if (winAmount > 0) {
            tokenInstance.transfer(_userAddress, winAmount); // transfer winning amount to player
        }

        // notify server of reels numbers and winning amount if any
        emit SpinResult(_userAddress, tokenSymbol, _landID, number, _machineID, winAmount);
    }

    function () payable external {} //can sends tokens directly

    function addFunds(uint256 _amountMANA) external onlyCEO {
        require(_amountMANA > 0, "No funds sent");

        tokenInstance.transferFrom(msg.sender, address(this), _amountMANA);
        funds = tokenInstance.balanceOf(address(this));

        emit NewBalance(funds); // notify server of new contract balance
    }

    function checkFunds() external view returns (uint256 fundsInContract) {
        fundsInContract = tokenInstance.balanceOf(address(this));
    }

    function setAmounts(uint256 _minimumBet) external onlyCEO {
        minimumBet = _minimumBet;
    }

    function withdrawFunds(uint256 _amount) external onlyCEO {
        funds = tokenInstance.balanceOf(address(this));
        require(_amount <= funds, "Amount more than contract balance");

        if (_amount == 0) {
            _amount = funds;
        }

        tokenInstance.transfer(ceoAddress, _amount); // transfer contract funds to contract owner
        funds = tokenInstance.balanceOf(address(this));

        emit NewBalance(funds); // notify server of new contract balance
    }

}
