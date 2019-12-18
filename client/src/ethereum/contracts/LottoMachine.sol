pragma solidity ^0.4.25;

// LottoMachine Smart Contract ///////////////////////////////////////////////////////////
// Author: Steven Becerra ////////////////////////////////////////////////////////////////
contract AccessControl {
    address public ceoAddress; // contract's owner and manager address
    address public devAddress; // contract's developer address

    bool public paused = false; // keeps track of whether or not contract is paused

    // AccessControl constructor - sets default executive roles of contract to the sender account
    constructor() public {
        ceoAddress = msg.sender;
        devAddress = msg.sender;
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
    }

    // assigns new developer address - only available to the current developer
    function setDev(address _newDev) public {
        require(msg.sender == devAddress);
        require(_newDev != address(0));
        
        devAddress = _newDev;
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
    }

    // unpauses the smart contract - can only be called by the CEO
    function unpause() public onlyCEO whenPaused {
        paused = false;
    }
}

contract LottoMachine is AccessControl {
    using SafeMath for uint256;
    
    event PlayerAdded(uint256 _newNumber, address[] _players, uint256 _jackpot);
    event WinnerSelected(uint256 _number, address[] _players, uint256 _jackpot);
    
    address[] public players; // list of players in this game
    uint256 public ticketPrice = 0.1 ether; // contract's default ticket price
    bool public ticketSale = false; // status of ticket sale
    
    uint256 public jackpotGross = 0; // entire contract amount
    uint256 public jackpotAdjusted = 0; // 95% of gross jackpot
    
    function play() public payable whenNotPaused {
        require(ticketSale == true, "Tickets are currently not on sale");
        require(msg.value >= ticketPrice, "Amount sent is less than ticket price");
        
        uint256 playerNumber = players.push(msg.sender) - 1; // add new player to players array
        jackpotGross = address(this).balance;
        jackpotAdjusted = jackpotGross.mul(9500).div(10000); // winner receives 95% of jackpot
        
        emit PlayerAdded(playerNumber, players, jackpotAdjusted); // notify client of new player and jackpot
    }
    
    function pickWinner(uint256 _timestamp) public onlyCEO {
        require(ticketSale == false, "Tickets are currently on sale");
        uint256 index = randomNumber(_timestamp) % players.length; // randomly determine winner
        
        jackpotGross = address(this).balance;
        uint256 contractCut = jackpotGross.mul(500).div(10000); // owner receives 5% of jackpot
        uint256 playersCut = jackpotGross.sub(contractCut); // player receives 95% of jackpot
        
        _transfer(contractCut);
        players[index].transfer(playersCut);
        
        players = new address[](0); // players array is now empty
        jackpotGross = address(this).balance; // the contract balance is now 0 
        jackpotAdjusted = address(this).balance; // the adjusted jackpot is now 0
        
        // notify client of winner and confirm players array and jackpot are empty
        emit WinnerSelected(index, players, jackpotGross);
    }
    
    function _transfer(uint256 _contractCut) private {
        uint256 devCut = _contractCut.mul(2000).div(10000); // developer receives 20%
        uint256 ceoCut = _contractCut.sub(devCut); // ceo receives 80%
        
        devAddress.transfer(devCut);
        ceoAddress.transfer(ceoCut);
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
    function getOwner(uint256 _number) public view returns (address) {
        return players[_number];
    }
    
    function getJackpot() public view returns (uint256) {
        return jackpotAdjusted;
    }
    
    function setTicketPrice(uint _ticketPrice) public whenNotPaused onlyCEO {
        require(ticketSale == false, "Tickets are currently on sale");
        
        ticketPrice = _ticketPrice;
    }
    
    function getTicketPrice() public view returns (uint256) {
        return ticketPrice;
    }
    
    function ticketsOnSale(bool _newState) public whenNotPaused onlyCEO {
        ticketSale = _newState;
    }
    
    function randomNumber(uint256 _timestamp) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, _timestamp, players)));
    }
}

library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
