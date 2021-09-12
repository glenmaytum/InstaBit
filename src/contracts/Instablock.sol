pragma solidity ^0.5.0;

contract Instablock {
  string public name = "Instablock";
  
  //Store Images
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );



  //Create Images
  function uploadImage(string memory _imgHash, string memory _description) public {
    //Make sure image hash exists
    require(bytes(_imgHash).length > 0);

    //Make sure image description exists
    require(bytes(_description).length > 0);

    //Make sure uploader address exists
    require(msg.sender != address(0x0));

    //Increment image Id
    imageCount ++;

  //Add images to contract
  images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

  //Trigger on event 
  emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }

  //Tip Images
  function tipImageOwner(uint _id) public payable {
    //Make suer the id is valid
    require(_id > 0 && _id <= imageCount);
    //Fetch the image from storage
    Image memory _image = images[_id];
    //Fetch the author
    address payable _author = _image.author; 
    //Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // Update the image
    images[_id] = _image;

  //Trigger an event
  emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);

  }

}