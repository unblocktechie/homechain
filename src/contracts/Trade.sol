pragma solidity ^0.5.16;

import "./Home.sol";

contract Trade {
  string public name = "Home trade";
  Home public home;
  mapping(uint => Item) public homeList;
  
  struct Item {
        bool forSell;
        uint256 price;
    }
  
  constructor(Home _home) public {
    home = _home;
  }
  
  function listHome(uint _id, uint256 _price) public {
    address _owner = home.ownerOf(_id);
    require(msg.sender == _owner);
    homeList[_id] = Item(true,_price);
  }
  
  function buyHome(uint _id) public payable{
     address _approved = home.getApproved(_id);
     require(address(this) == _approved);
     require(homeList[_id].forSell);
     require(homeList[_id].price <= msg.value);
     address _owner = home.ownerOf(_id);
     address payable wallet = address(uint160(_owner));
     wallet.transfer(msg.value);
     home.transferFrom( _owner, msg.sender, _id);
     homeList[_id] = Item(false,0);
  }

}