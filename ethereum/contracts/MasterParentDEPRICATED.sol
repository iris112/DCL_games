pragma solidity ^0.5.14;

import "./SafeMath.sol";
import "./AccessControl.sol";
import "./ERC20Token.sol";
import "./GameInterface.sol";
import "./HashChain.sol";

contract MasterParent is HashChain, AccessControl {

    using SafeMath for uint256;
    event NewBalance(uint256 _gameID, uint256 _balance);

    uint256 public globalMaximumBet = 1000 ether; // contract's bet price
    uint256 public winAmount = 0; // last winning amount
    uint256 public number = 0; // last reels numbers
    uint256 public maximumBetsAmount = 36; // contract's maximum amount of bets
    uint256[] public funds; // funds in contract per game
    //address[] public tokens; // possible tokens for the game

    mapping (string => address) public tokens;
    GameInstance[] public games;

    constructor(address defaultToken, string memory tokenName) public {

        //tokens[0] = 0x2a8Fd99c19271F4F04B1B7b9c4f7cF264b626eDB; //default token - Ropsten MANA
        //tokens[0] = 0xDd1B834a483fD754c8021FF0938f69C1d10dA81F; //default token - Matic MANA
        //tokens[0] = 0x7801E36D90A2d41a35fA3fA26533E6864de9F467; //default token - Ropsten MOL

        //set default token
        tokens[tokenName] = defaultToken;
    }

    function addGame(GameInstance _newGame) external onlyCEO {
        games.push(_newGame);
        funds.push(0);
    }

    function updateGame(uint256 _gameID, GameInstance _newGame) external onlyCEO {
        games[_gameID] = _newGame;
    }

    function removeGame(uint256 _gameID) external onlyCEO {
        delete games[_gameID];
        delete funds[_gameID];
    }

    function addToken(address _tokenAddress, string calldata _tokenName) external onlyCEO {
        tokens[_tokenName] = _tokenAddress;
    }

    function updateToken(address _newTokenAddress, string calldata _tokenName) external onlyCEO {
        tokens[_tokenName] = _newTokenAddress;
    }

    function checkApproval(address _userAddress, string memory _tokenName) public view whenNotPaused returns(uint approved) {
        approved = ERC20Token(tokens[_tokenName]).allowance(_userAddress, address(this));
    }

    function bet(uint _gameID, uint _betID, address _userAddress, uint _number, uint _value) internal whenNotPaused {
        require(_value <= globalMaximumBet, "bet amount is more than maximum");
        games[_gameID].createBet(_betID, _userAddress, _number, _value);
    }

    function setTail(bytes32 _tail) external onlyCEO {
        _setTail(_tail);
    }

    function testing(bytes32 _localhash) external onlyCEO returns (bool) {
        _consume(_localhash);
        return true;
    }

    function play(
        uint256 _gameID,
        address _userAddress,
        uint256 _landID,
        uint256 _machineID,
        uint256[] memory _betIDs,
        uint256[] memory _betValues,
        uint256[] memory _betAmount,
        bytes32 _localhash,
        string memory _tokenName
    ) public whenNotPaused onlyWorker {

        _consume(_localhash); //hash-chain check

        require(_betIDs.length == _betValues.length, "inconsistent amount of bets/values");
        require(_betIDs.length == _betAmount.length, "inconsistent amount of bets/amount");
        require(_betIDs.length <= maximumBetsAmount, "maximum amount of bets per game is 36");

        GameInstance _game = games[_gameID];
        ERC20Token _token = ERC20Token(tokens[_tokenName]);

        //calculating totalBet based on all bets
        uint256 totalTokenBet = 0;
        for (uint i = 0; i < _betIDs.length; i++) {
            totalTokenBet = totalTokenBet.add(_betAmount[i]);
        }
        require(_token.allowance(_userAddress, address(this)) >= totalTokenBet, "must approve/allow this contract as spender");

        //check necessary funds for payout based on betID
        uint256 necessaryBalance = 0;
        for (uint i = 0; i < _betIDs.length; i++) {
            uint256 fundsPerBet = _game.getPayoutForType(_betIDs[i]);
            if (_betIDs[i] > 0) {
                necessaryBalance = necessaryBalance.add(fundsPerBet.mul(_betAmount[i]));
            } else {
                necessaryBalance = necessaryBalance.add(fundsPerBet);
            }
        }
        //funds[_gameID] = funds[_gameID].add(totalTokenBet);   //consider adding the bet to payout amount before calculating
        require(necessaryBalance <= funds[_gameID], 'must have enough funds for payouts');

        //get user tokens if approved
        funds[_gameID] = funds[_gameID].add(totalTokenBet);
        _token.transferFrom(_userAddress, address(this), totalTokenBet);

        //set bets for the game
        for (uint i = 0; i < _betIDs.length; i++) {
            if (_betIDs[i] > 0) {
                bet(_gameID, _betIDs[i], _userAddress, _betValues[i], _betAmount[i]);
            }
        }

        //play game
        (winAmount) = _game.launch(
            _localhash,
            _userAddress,
            _machineID,
            _landID,
            _tokenName
        );

        //issue reward
        if (winAmount > 0) {
            funds[_gameID] = funds[_gameID].sub(winAmount); //keep balance of tokens per game
            _token.transfer(_userAddress, winAmount); // transfer winning amount to player
        }

        // notify server of reels numbers and winning amount if any
        //emit GameResult(_userAddress, tokenSymbol, _landID, number, _machineID, winAmount);
    }

    function () payable external {} //can sends tokens directly

    function manaulAllocation(uint256 _gameID, uint256 _tokenAmount) external onlyCEO {
        funds[_gameID] = funds[_gameID].add(_tokenAmount);
    }

    function addFunds(uint256 _gameID, uint256 _tokenAmount, string calldata _tokenName) external onlyCEO {

        ERC20Token _token = ERC20Token(tokens[_tokenName]);

        require(_tokenAmount > 0, "No funds sent");
        require(_token.allowance(msg.sender, address(this)) >= _tokenAmount, "must allow to transfer");
        require(_token.balanceOf(msg.sender) >= _tokenAmount, "user must have enough tokens");

        _token.transferFrom(msg.sender, address(this), _tokenAmount);
        funds[_gameID] = funds[_gameID].add(_tokenAmount);

        emit NewBalance(_gameID, funds[_gameID]); // notify server of new contract balance
    }

    function checkFunds(uint256 _gameID) external view returns (uint256 fundsInContract) {
        fundsInContract = funds[_gameID];
    }

    function setGlobalMaximumBet(uint256 _maximumBet) external onlyCEO {
        globalMaximumBet = _maximumBet;
    }

    function withdrawCollateral(uint256 _gameID, uint256 _amount, string calldata _tokensName) external onlyCEO {
        require(_amount <= funds[_gameID], "Amount more than game allocated balance");

        ERC20Token token = ERC20Token(tokens[_tokensName]);

        if (_amount == 0) {
            _amount = funds[_gameID];
        }

        funds[_gameID] = funds[_gameID].sub(_amount);
        token.transfer(ceoAddress, _amount); // transfer contract funds to contract owner

        emit NewBalance(_gameID, funds[_gameID]); // notify server of new contract balance
    }

}
