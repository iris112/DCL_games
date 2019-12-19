pragma solidity ^0.4.25;

// AccessControl script provided by Nathan Glover: https://github.com/t04glovern/cryptodoggies
contract AccessControl {
    /// @dev The addresses of the accounts (or contracts) that can execute actions within each roles
    address public ceoAddress;
    address public cooAddress;

    /// @dev Keeps track whether the contract is paused. When that is true, most actions are blocked
    bool public paused = false;

    /// @dev The AccessControl constructor sets the original C roles of the contract to the sender account
    constructor() public {
        ceoAddress = msg.sender;
        cooAddress = msg.sender;
    }

    /// @dev Access modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    /// @dev Access modifier for COO-only functionality
    modifier onlyCOO() {
        require(msg.sender == cooAddress);
        _;
    }

    /// @dev Access modifier for any CLevel functionality
    modifier onlyCLevel() {
        require(msg.sender == ceoAddress || msg.sender == cooAddress);
        _;
    }

    /// @dev Assigns a new address to act as the CEO. Only available to the current CEO
    /// @param _newCEO The address of the new CEO
    function setCEO(address _newCEO) public onlyCEO {
        require(_newCEO != address(0));
        ceoAddress = _newCEO;
    }

    /// @dev Assigns a new address to act as the COO. Only available to the current CEO
    /// @param _newCOO The address of the new COO
    function setCOO(address _newCOO) public onlyCEO {
        require(_newCOO != address(0));
        cooAddress = _newCOO;
    }

    /// @dev Modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /// @dev Modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused);
        _;
    }

    /// @dev Pause the smart contract. Only can be called by the CEO
    function pause() public onlyCEO whenNotPaused {
        paused = true;
    }

    /// @dev Unpauses the smart contract. Only can be called by the CEO
    function unpause() public onlyCEO whenPaused {
        paused = false;
    }
}

// Interface for required functionality in the ERC721 standard for non-fungible tokens.
// Author: Nadav Hollander (nadav at dharma.io)
// https://github.com/dharmaprotocol/NonFungibleToken/blob/master/contracts/ERC721.sol
contract ERC721 {
    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    /// For querying totalSupply of token.
    function totalSupply() public view returns (uint256 _totalSupply);

    /// For querying balance of a particular account.
    /// @param _owner The address for balance query.
    /// @dev Required for ERC-721 compliance.
    function balanceOf(address _owner) public view returns (uint256 _balance);

    /// For querying owner of token.
    /// @param _tokenId The tokenID for owner inquiry.
    /// @dev Required for ERC-721 compliance.
    function ownerOf(uint256 _tokenId) public view returns (address _owner);

    /// @notice Grant another address the right to transfer token via takeOwnership() and transferFrom()
    /// @param _to The address to be granted transfer approval. Pass address(0) to
    ///  clear all approvals.
    /// @param _tokenId The ID of the Token that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function approve(address _to, uint256 _tokenId) public;

    // NOT IMPLEMENTED
    // function getApproved(uint256 _tokenId) public view returns (address _approved);

    /// Third-party initiates transfer of token from address _from to address _to.
    /// @param _from The address for the token to be transferred from.
    /// @param _to The address for the token to be transferred to.
    /// @param _tokenId The ID of the Token that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function transferFrom(address _from, address _to, uint256 _tokenId) public;

    /// Owner initates the transfer of the token to another account.
    /// @param _to The address of the recipient, can be a user or contract.
    /// @param _tokenId The ID of the token to transfer.
    /// @dev Required for ERC-721 compliance.
    function transfer(address _to, uint256 _tokenId) public;

    ///
    function implementsERC721() public view returns (bool _implementsERC721);

    // EXTRA
    /// @notice Allow pre-approved user to take ownership of a token.
    /// @param _tokenId The ID of the token that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function takeOwnership(uint256 _tokenId) public;
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// Digipet Smart Contract ////////////////////////////////////////////////////////////////
// Author: Steven Becerra (https://github.com/mobiman1) //////////////////////////////////
contract DetailedERC721 is ERC721 {
    function name() public view returns (string _name);
    function symbol() public view returns (string _symbol);
}

contract Digipet is AccessControl, DetailedERC721 {
    using SafeMath for uint256;

    event PetCreated(
        uint256 indexed newPetID, 
        uint128 dnaPet, 
        uint64 birthday, 
        uint16 generation, 
        uint8 pedigree,
        uint64 motherID, 
        uint64 fatherID, 
        uint256 descendants,
        uint256 price, 
        bool forSale,
        address indexed owner
    );
    
    event PetSold(
        uint256 indexed petID, 
        uint128 dnaPet,
        uint64 birthday,
        uint16 generation,
        uint8 pedigree,
        uint64 motherID,
        uint64 fatherID,
        uint256 descendants,
        uint256 price, 
        bool forSale,
        address indexed oldOwner,
        address indexed newOwner
    );

    mapping(uint128 => bool) private dnaRegistered;
    mapping(uint128 => uint256) private dnaToPetID;
    mapping (uint256 => address) private petIDToOwner;
    mapping (uint256 => uint256) private petIDToPrice;
    mapping (address => uint256) private ownershipPetCount;
    mapping (uint256 => address) private petIDToApproved;
    mapping (uint256 => uint256) private petIDToDescendants;
    mapping (uint256 => bool) private petIDToSelling;

    struct Pet {
        uint128 dnaPet;
        uint48 birthday;
        uint16 generation;
        uint8 pedigree;
        uint64 motherID;
        uint64 fatherID;
    }

    Pet[] private pets;

    uint256 private generation0Amount = 0;
    uint256 private startingPrice = 0.01 ether;
    bool private erc721Enabled = false;

    modifier onlyERC721() {
        require(erc721Enabled, "Not ERC-721 compliant");
        _;
    }

    function createPet(
        uint128 _dnaPet, 
        uint16 _generation, 
        uint8 _pedigree, 
        uint64 _motherID, 
        uint64 _fatherID
    ) public payable whenNotPaused {
        // restrict to 999 generation 0 pets in total
        if (_generation == 0) {
            require(generation0Amount < 999, "No more generation 0 pets may be created");
            require(msg.sender == ceoAddress, "New owner must be CEO");

            generation0Amount++;
        } else {
            require(msg.sender != address(0), "Not a valid address");
            require(msg.value >= startingPrice, "Amount sent is less than price");    

            petIDToDescendants[_motherID]++; // increment mother's number of descendants
            petIDToDescendants[_fatherID]++; // increment father's number of descendants
        }
        require(dnaRegistered[_dnaPet] != true, "DNA already registered, please regenerate pet and try again");
        dnaRegistered[_dnaPet] = true;

        uint48 _birthday = uint48(now); // set the pet's birthday to blockchain's timestamp

        Pet memory _pet = Pet({
            dnaPet: _dnaPet,
            birthday: _birthday,
            generation: _generation,
            pedigree: _pedigree,
            motherID: _motherID,
            fatherID: _fatherID
        });
        
        uint256 newPetID = pets.push(_pet) - 1;
        dnaToPetID[_dnaPet] = newPetID; // map the pet's dna to its ID
        petIDToDescendants[newPetID] = 0; // set the default number of descendants to zero
        petIDToPrice[newPetID] = startingPrice; // owner's initial sale price is the default starting price
        petIDToSelling[newPetID] = false; // this pet is off the market until the new owner makes it available

        emit PetCreated(
            newPetID, 
            _dnaPet, 
            _birthday, 
            _generation, 
            _pedigree,
            _motherID, 
            _fatherID, 
            0,
            startingPrice, 
            false,
            msg.sender
        );
        _transfer(address(0), msg.sender, newPetID);
    }

    function purchase(uint256 _petID) public payable whenNotPaused {
        Pet memory petData = pets[_petID]; // to avoid 'stack too deep' error

        address oldOwner = ownerOf(_petID);
        address newOwner = msg.sender;
        bool forSale = petIDToSelling[_petID];
        uint256 price = priceOf(_petID);
        uint256 descendants = petIDToDescendants[_petID];

        require(oldOwner != address(0), "Not a valid address");
        require(newOwner != address(0), "Not a valid address");
        require(oldOwner != newOwner, "New owner is same as old owner");
        require(!_isContract(newOwner), "Contract's address is new owner");
        require(forSale == true, "This pet is not for sale");
        require(price > 0, "Price is less than or equal to 0");
        require(msg.value >= price, "Amount sent is less than price");

        petIDToSelling[_petID] = false; // this pet is off the market until the new owner makes it available

        _transfer(oldOwner, newOwner, _petID);

        emit PetSold(
            _petID,
            petData.dnaPet,
            petData.birthday,
            petData.generation,
            petData.pedigree,
            petData.motherID,
            petData.fatherID,
            descendants,
            price,
            false,
            oldOwner,
            newOwner
        );

        uint256 contractCut = price.mul(500).div(10000); // contract receives 5% cut
        oldOwner.transfer(price.sub(contractCut));
    }

    function withdrawBalance(address _to, uint256 _amount) public onlyCEO {
        require(_amount <= address(this).balance, "Amount more than contract balance");

        if (_amount == 0) {
            _amount = address(this).balance;
        } 

        if (_to == address(0)) {
            ceoAddress.transfer(_amount);
        } else {
            _to.transfer(_amount);
        }
    }

    function getPet(uint256 _petID) public view returns (
        uint128 _dnaPet,
        uint64 _birthday,
        uint16 _generation, 
        uint8 _pedigree,
        uint64 _motherID,
        uint64 _fatherID,
        uint256 _descendants,
        uint256 _price,
        bool _forSale,
        address _owner
    ) {
        _dnaPet = pets[_petID].dnaPet;
        _birthday = pets[_petID].birthday;
        _generation = pets[_petID].generation;
        _pedigree = pets[_petID].pedigree;
        _motherID = pets[_petID].motherID;
        _fatherID = pets[_petID].fatherID;
        _descendants = petIDToDescendants[_petID];
        _price = petIDToPrice[_petID];
        _forSale = petIDToSelling[_petID];
        _owner = petIDToOwner[_petID];
    }

    function getAllPets() public view returns (
        uint256[],
        address[]
    ) {
        uint256 total = totalSupply();
        uint256[] memory prices = new uint256[](total);
        address[] memory owners = new address[](total);

        for (uint256 i = 0; i < total; i++) {
            prices[i] = petIDToPrice[i];
            owners[i] = petIDToOwner[i];
        }

        return (prices, owners);
    }

    function petsOf(address _owner) public view returns(uint256[]) {
        uint256 petsCount = balanceOf(_owner);

        if (petsCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](petsCount);
            uint256 total = totalSupply();
            uint256 resultIndex = 0;

            for (uint256 i = 0; i < total; i++) {
                if (petIDToOwner[i] == _owner) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    function getGen0Amount() public view returns (uint256) {
        return generation0Amount;
    }

    function getPetID(uint128 _dnaPet) public view returns (uint256) {
        return dnaToPetID[_dnaPet];
    }

    function getDescendants(uint256 _petID) public view returns (uint256) {
        return petIDToDescendants[_petID];
    }

    function priceOf(uint256 _petID) public view returns (uint256) {
        return petIDToPrice[_petID];
    }

    function getStartingPrice() public view returns (uint256) {
        return startingPrice;
    }

    function setStartingPrice(uint _startingPrice) public whenNotPaused onlyCEO {
        startingPrice = _startingPrice;
    }

    function setNewPrice(uint _newPrice, uint256 _petID) public whenNotPaused {
        require(_owns(msg.sender, _petID), "Sender not authorized");

        petIDToPrice[_petID] = _newPrice;
    }

    function startOrStopSelling(bool _newState, uint256 _petID) public whenNotPaused {
        require(_owns(msg.sender, _petID), "Sender not authorized");

        petIDToSelling[_petID] = _newState;
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // ERC-721 overriding behaviors //////////////////////////////////////////////////////////
    function enableERC721() public onlyCEO {
        erc721Enabled = true;
    }

    function approve(address _to, uint256 _petID) public whenNotPaused onlyERC721 {
        require(_owns(msg.sender, _petID), "Sender not authorized");
        
        petIDToApproved[_petID] = _to;
        emit Approval(msg.sender, _to, _petID);
    }
    
    function takeOwnership(uint256 _petID) public whenNotPaused onlyERC721 {
        require(_approved(msg.sender, _petID), "Sender not authorized");

        _transfer(petIDToOwner[_petID], msg.sender, _petID);
    }

    function transferFrom(address _from, address _to, uint256 _petID) public whenNotPaused onlyERC721 {
        require(_to != address(0), "Not a valid address");
        require(_owns(_from, _petID), "Sender not authorized");
        require(_approved(msg.sender, _petID), "Transfer is not authorized");

        _transfer(_from, _to, _petID);
    }

    function transfer(address _to, uint256 _petID) public whenNotPaused onlyERC721 {
        require(_to != address(0), "Not a valid address");
        require(_owns(msg.sender, _petID), "Sender not authorized");

        _transfer(msg.sender, _to, _petID);
    }
    
    function _transfer(address _from, address _to, uint256 _petID) private {
        ownershipPetCount[_to]++;
        petIDToOwner[_petID] = _to;

        if (_from != address(0)) {
            ownershipPetCount[_from]--;
            delete petIDToApproved[_petID]; // clear any pending approvals
        }

        emit Transfer(_from, _to, _petID);
    }

    function implementsERC721() public view whenNotPaused returns (bool) {
        return erc721Enabled;
    }
    
    function totalSupply() public view returns (uint256) {
        uint256 _totalSupply = pets.length;
        
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        uint256 _balance = ownershipPetCount[_owner];
        
        return _balance;
    }

    function ownerOf(uint256 _petID) public view returns (address) {
        address _owner = petIDToOwner[_petID];
        
        return _owner;
    }

    function _owns(address _claimant, uint256 _petID) private view returns (bool) {
        return petIDToOwner[_petID] == _claimant;
    }

    function _approved(address _to, uint256 _petID) private view returns (bool) {
        return petIDToApproved[_petID] == _to;
    }

    function _isContract(address addr) private view returns (bool) {
        uint256 size;
        
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
    
    function name() public view returns (string _name) {
        _name = "Digipet";
    }

    function symbol() public view returns (string _symbol) {
        _symbol = "DGP";
    }
}
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

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
