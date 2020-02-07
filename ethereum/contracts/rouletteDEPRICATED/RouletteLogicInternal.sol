pragma solidity ^0.5.13;

import "./SafeMath.sol";
import "./ERC20Token.sol";

contract RouletteLogicInternal {
    using SafeMath for uint;
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
        if (_betID == 3301) {
            betSingle(_number, _player, _value);
        }
        else if (_betID == 3302) {
            betEven(_player, _value);
        }
        else if (_betID == 3303) {
            betOdd(_player, _value);
        }
        else if (_betID == 3304) {
            betRed(_player, _value);
        }
        else if (_betID == 3305) {
            betBlack(_player, _value);
        }
        else if (_betID == 3305) {
            betBlack(_player, _value);
        }
        else if (_betID == 3306) {
            betHigh(_player, _value);
        }
        else if (_betID == 3307) {
            betLow(_player, _value);
        }
        else if (_betID == 3308) {
            betColumn(_number, _player, _value);
        }
        else if (_betID == 3309) {
            betDozen(_number, _player, _value);
        }
    }

    //3301
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

    //3302
    function betEven(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Even) {
        bets.push(Bet({
            betType: BetType.Even,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewEvenBet(bets.length, _player, _value);
    }

    //3303
    function betOdd(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Even) {
        bets.push(Bet({
            betType: BetType.Odd,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewOddBet(bets.length, _player, _value);
    }

    //3304
    function betRed(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Red) {
        bets.push(Bet({
            betType: BetType.Red,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewRedBet(bets.length, _player, _value);
    }

    //3305
    function betBlack(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Black) {
        bets.push(Bet({
            betType: BetType.Black,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewBlackBet(bets.length, _player, _value);
    }

    //3306
    function betHigh(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.High) {
        bets.push(Bet({
            betType: BetType.High,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewHighBet(bets.length, _player, _value);
    }

    //3307
    function betLow(address _player, uint _value) internal transactionMustContainValue() bankMustBeAbleToPayForBetType(BetType.Low) {
        bets.push(Bet({
            betType: BetType.Low,
            player: _player,
            number: 0,
            value: _value
        }));
        emit NewLowBet(bets.length, _player, _value);
    }

    //3308
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

    //3309
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
                //b.value = b.value * getPayoutForType(b.betType);
                uint256 betWin = b.value.mul(getPayoutForType(b.betType));
                winAmount = winAmount.add(betWin);
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
