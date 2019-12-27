
// File: contracts/roulette-example/SafeMath.sol

pragma solidity ^0.5.13;

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: contracts/roulette-example/AccessControl.sol

pragma solidity ^0.5.13;

contract AccessControl {
    address public ceoAddress; // contract's owner and manager address

    bool public paused = false; // keeps track of whether or not contract is paused

    /**
    @notice fired when a new address is set as CEO
    */
    event CEOSet(address newCEO);

    /**
    @notice fired when the contract is paused
     */
    event Paused();

    /**
    @notice fired when the contract is unpaused
     */
    event Unpaused();

    // AccessControl constructor - sets default executive roles of contract to the sender account
    constructor() public {
        ceoAddress = msg.sender;
        emit CEOSet(ceoAddress);
    }

    // access modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    // assigns new CEO address - only available to the current CEO
    function setCEO(address _newCEO) public onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
        emit CEOSet(ceoAddress);
    }

    // modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    // modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused);
        _;
    }

    // pauses the smart contract - can only be called by the CEO
    function pause() public onlyCEO whenNotPaused {
        paused = true;
        emit Paused();
    }

    // unpauses the smart contract - can only be called by the CEO
    function unpause() public onlyCEO whenPaused {
        paused = false;
        emit Unpaused();
    }
}

// File: contracts/roulette-example/ERC20Token.sol

pragma solidity ^0.5.13;

//contract ERC20Token {
interface ERC20Token {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// File: contracts/roulette-example/RouletteLogicInternal.sol

pragma solidity ^0.5.13;



contract RouletteLogicInternal {

    uint public nextRoundTimestamp;
    enum BetType { Single, Odd, Even, Red, Black, High, Low, Column, Dozen }

    struct Bet {
        BetType betType;
        address player;
        uint256 number;
        uint256 value;
    }

    Bet[] public bets;

    event Finished(uint number, uint nextRoundTimestamp);
    event NewSingleBet(uint bet, address player, uint number, uint value);
    event NewEvenBet(uint bet, address player, uint value);
    event NewOddBet(uint bet, address player, uint value);
    event NewRedBet(uint bet, address player, uint value);
    event NewBlackBet(uint bet, address player, uint value);
    event NewHighBet(uint bet, address player, uint value);
    event NewLowBet(uint bet, address player, uint value);
    event NewColumnBet(uint bet, address player, uint column, uint value);
    event NewDozenBet(uint bet, address player, uint dozen, uint value);

    constructor() public payable {
	    nextRoundTimestamp = now;
    }

    function getNextRoundTimestamp() external view returns(uint) {
        return nextRoundTimestamp;
    }

    function getBetsCountAndValue() external view returns(uint, uint) {
        uint value = 0;
        for (uint i = 0; i < bets.length; i++) {
            value += bets[i].value;
        }
        return (bets.length, value);
    }

    function createBet(uint _betID, address _player, uint _number, uint _value) external {
        if (_betID == 3307) {
            betSingle(_number, _player, _value);
        }
        if (_betID == 3308) {
            betEven(_player, _value);
        }
        if (_betID == 3309) {
            betOdd(_player, _value);
        }
    }

    function betSingle(uint _number, address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Single) {
        require(_number <= 36, 'single bet must be in region between 0 and 36');
        bets.push(Bet({
            betType: BetType.Single,
            player: _player,
            number: _number,
            value: _value
        }));
        emit NewSingleBet(bets.length, _player, _number, _value);
    }

    function betEven(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Even) {
        bets.push(Bet({
            betType: BetType.Even,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewEvenBet(bets.length, _player, _value);
    }

    function betOdd(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Even) {
        bets.push(Bet({
            betType: BetType.Odd,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewOddBet(bets.length, _player, _value);
    }

    function betRed(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Red) {
        bets.push(Bet({
            betType: BetType.Red,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewRedBet(bets.length, _player, _value);
    }

    function betBlack(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Black) {
        bets.push(Bet({
            betType: BetType.Black,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewBlackBet(bets.length, _player, _value);
    }

    function betHigh(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.High) {
        bets.push(Bet({
            betType: BetType.High,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewHighBet(bets.length, _player, _value);
    }

    function betLow(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Low) {
        bets.push(Bet({
            betType: BetType.Low,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewLowBet(bets.length, _player, _value);
    }

    function betColumn(uint _column, address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Column) {
        require(_column > 1 && _column <= 3, 'column bet must be in region between 1 and 3');
        bets.push(Bet({
            betType: BetType.Column,
            player: _player,
            number: _column,
            value: _value
        }));
        emit NewColumnBet(bets.length, _player, _column, _value);
    }

    function betDozen(uint _dozen, address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Dozen) {
        require(_dozen > 1 && _dozen <= 3, 'dozen bet must be in region between 1 and 3');
        bets.push(Bet({
            betType: BetType.Dozen,
            player: _player,
            number: _dozen,
            value: _value
        }));
        emit NewDozenBet(bets.length, _player, _dozen, _value);
    }

    function launch(uint256 _localhash) external returns(uint256 winAmount, uint256 number) {
        require(now > nextRoundTimestamp, 'expired round');
        require(bets.length > 0, 'must have bets');

        /* next time we are allowed to spin the wheel again */
        nextRoundTimestamp = now;
        winAmount = 0;

        /* calculate 'random' number */
        uint diff = block.difficulty;
        uint256 hash = _localhash;
        //bytes32 hash = blockhash(block.number-1);
        Bet memory lb = bets[bets.length-1];
        number = uint(keccak256(abi.encodePacked(now, diff, hash, lb.betType, lb.player, lb.number))) % 37;

        for (uint i = 0; i < bets.length; i++) {
            bool won = false;
            Bet memory b = bets[i];
            if (b.betType == BetType.Single) {
                if (b.number == number) {
                    won = true;
                }
            } else if (b.betType == BetType.Even) {
                if (number > 0 && number % 2 == 0) {
                    won = true;
                }
            } else if (b.betType == BetType.Odd) {
                if (number > 0 && number % 2 == 1) {
                    won = true;
                }
            } else if (b.betType == BetType.Red) {
                if (number <= 10 || (number >= 20 && number <= 28)) {
                    won = (number % 2 == 1);
                } else {
                    won = (number % 2 == 0);
                }
            } else if (b.betType == BetType.Black) {
                if (number <= 10 || (number >= 20 && number <= 28)) {
                    won = (number % 2 == 0);
                } else {
                    won = (number % 2 == 1);
                }
            } else if (b.betType == BetType.High) {
                if (number >= 19) {
                    won = true;
                }
            } else if (b.betType == BetType.Low) {
                if (number <= 18) {
                    won = true;
                }
            } else if (b.betType == BetType.Column) {
                if (b.number == 1) won = (number % 3 == 1);
                if (b.number == 2) won = (number % 3 == 2);
                if (b.number == 3) won = (number % 3 == 0);
            } else if (b.betType == BetType.Dozen) {
                if (b.number == 1) won = (number <= 12);
                if (b.number == 2) won = (number > 12 && number <= 24);
                if (b.number == 3) won = (number > 24);
            }
            if (won) {
                b.value = b.value * getPayoutForType(b.betType);
                winAmount = winAmount + (b.value * getPayoutForType(b.betType));
                //b.player.transfer(b.value * getPayoutForType(b.betType));
            }
        }

        bets.length = 0;
        emit Finished(number, nextRoundTimestamp);
    }

    function getPayoutForType(BetType betType) public pure returns(uint256) {
        if (betType == BetType.Single) return 35;
        if (betType == BetType.Even || betType == BetType.Odd) return 2;
        if (betType == BetType.Red || betType == BetType.Black) return 2;
        if (betType == BetType.Low || betType == BetType.High) return 2;
        if (betType == BetType.Column || betType == BetType.Dozen) return 3;
        return 0;
    }

    modifier transactionMustContainValue() {
        //require(msg.value != 0, 'bet must have value');
        _;
    }

    modifier bankMustBeAbleToPayForBetType(BetType betType) {
        /*uint necessaryBalance = 0;
        for (uint i = 0; i < bets.length; i++) {
            necessaryBalance += getPayoutForType(bets[i].betType) * bets[i].value;
        }
        necessaryBalance += getPayoutForType(betType) * msg.value;
        require(necessaryBalance <= address(this).balance, 'must have enough funds for payouts');*/
        _;
    }
}

// File: contracts/roulette-example/RouletteMANA.sol

pragma solidity ^0.5.13;





contract RouleteMANA is AccessControl {
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
    //bytes5 tokenSymbol = 'MANA'; // coin type
    bytes5 tokenSymbol = 'MOL'; // coin type

    uint256 [] public betAmounts = [10,25,30,50];

    ERC20Token manaToken = ERC20Token(
        //0xDd1B834a483fD754c8021FF0938f69C1d10dA81F // Matic
        0x7801E36D90A2d41a35fA3fA26533E6864de9F467 // ROPSTEN//MOL
        //0x2a8Fd99c19271F4F04B1B7b9c4f7cF264b626eDB // Ropsten//MANA
    );

    RouletteLogicInternal public rlt;

    constructor(RouletteLogicInternal _rlt) public {
        rlt = _rlt;
        emit RLTChanged(rlt);
    }

    function changeRLT(RouletteLogicInternal _rlt) public onlyCEO {
        rlt = _rlt;
        emit RLTChanged(rlt);
    }

    function approve(uint256 _amount) public whenNotPaused {
        manaToken.approve(address(this), _amount);
    }

    function checkApproval(address _userAddress) public view whenNotPaused returns(uint approved) {
        approved = manaToken.allowance(_userAddress, address(this));
    }

    function bet(uint _betID, address _userAddress, uint _number, uint _value) public whenNotPaused {
        require(_value >= minimumBet, "Amount sent is less than bet price");
        manaToken.transferFrom(_userAddress, address(this), _value);
        rlt.createBet(_betID, _userAddress, _number, _value);
    }

    function play(
        address _userAddress,
        uint256 _landID,
        uint256 _amountBet,
        uint256 _machineID,
        uint256 _localhash
    //) public whenNotPaused onlyCEO {
    ) public whenNotPaused {
        uint256 amountMANA = manaToken.balanceOf(address(this));
        require(amountMANA >= 0, "Insuficient funds in contract");

        //get user tokens
        manaToken.transferFrom(_userAddress, address(this), _amountBet);

        //play
        (winAmount, number) = rlt.launch(
            _localhash
        );

        if (winAmount > 0) {
            manaToken.transfer(_userAddress, winAmount); // transfer winning amount to player
        }

        // notify server of reels numbers and winning amount if any
        emit SpinResult(_userAddress, tokenSymbol, _landID, number, _machineID, winAmount);
    }

    function () payable external {}

    function addFunds(uint256 _amountMANA) public onlyCEO {
        require(_amountMANA > 0, "No funds sent");

        manaToken.transferFrom(msg.sender, address(this), _amountMANA);
        funds = manaToken.balanceOf(address(this));

        emit NewBalance(funds); // notify server of new contract balance
    }

    function checkFunds() public view returns (uint256 fundsInContract) {
        fundsInContract = manaToken.balanceOf(address(this));
    }

    function setAmounts(uint256 _minimumBet) public onlyCEO {
        minimumBet = _minimumBet;
    }

    function setBetAmounts(uint256[] memory _betAmounts) public onlyCEO {
        betAmounts = _betAmounts;
    }

    function withdrawFunds(uint256 _amount) public onlyCEO {
        funds = manaToken.balanceOf(address(this));
        require(_amount <= funds, "Amount more than contract balance");

        if (_amount == 0) {
            _amount = funds;
        }
        manaToken.transfer(ceoAddress, _amount); // transfer contract funds to contract owner
        funds = manaToken.balanceOf(address(this));

        emit NewBalance(funds); // notify server of new contract balance
    }

}
