// SPDX-License-Identifier: MIT

pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Home is ERC721Full {
  address public manager;
  House[] public homes;
  uint public homeCount = 0;
  mapping(uint256 => bool) homeExists;
  
  struct House {
        uint tokenId;
        uint256 regNumber;
        string name;
        string propertyAddress;
        uint year;
        uint area;
        uint numberOfFloors;
        uint numberOfRooms;
  }

  constructor() ERC721Full("Home", "HM") public {
      manager = msg.sender;
  }

  function mint(uint256 _regNo, string memory _name, string memory _adr, uint _year, uint _area, uint _floors, uint _rooms) public {
    require(!homeExists[_regNo]);
    require(msg.sender==manager);
    require(homeCount<5);
    uint _cnt = homeCount+1;
    homes.push(House(_cnt, _regNo, _name, _adr, _year, _area, _floors, _rooms));
    _mint(msg.sender, _cnt);
    homeCount++;
    homeExists[_regNo] = true;
  }

}
