// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Royalty} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract FluidDAONFT is ERC721, ERC721Enumerable, ERC721Royalty, Ownable, ReentrancyGuard {

    event Minted(uint256 indexed tokenId, address receiver);
    event Burned(uint256 indexed tokenId);

    using Strings for uint256;
    address public auctionHouse;
    address public royaltyWallet;
    uint256 public _totalSupply;
    string private _baseURIExtended;
    mapping(uint256 => string) _tokenURIs;

    constructor() ERC721("FluidDAONFT", "FLDN") {
        _setDefaultRoyalty(royaltyWallet, 1000); // TODO: validate this is 10%
    }

    modifier onlyAuctionHouse() {
        require(msg.sender == auctionHouse, "caller is not the auctionHouse");
        _;
    }

    function setAuctionHouse(address _auctionHouse) external onlyOwner {
        auctionHouse = _auctionHouse;
    }

    function setRoyaltyWallet(address _royaltyWallet) external onlyOwner {
        royaltyWallet = _royaltyWallet;
    }

    function mint(address receiver)
        external
        onlyAuctionHouse
        nonReentrant
        returns (uint256)
    {
        _safeMint(receiver, ++_totalSupply, "");
        emit Minted(_totalSupply, receiver);
        return _totalSupply;
    }

    function burn(uint256 tokenId) external onlyAuctionHouse nonReentrant {
        _burn(tokenId);
        emit Burned(tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    // Sets base URI for all tokens, only able to be called by contract owner
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIExtended = baseURI_;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI_)
        external
        onlyOwner
    {
        _tokenURIs[tokenId] = tokenURI_;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length != 0) {
            return _tokenURI;
        }

        string memory base = _baseURI();
        require(bytes(base).length != 0, "baseURI not set");
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
