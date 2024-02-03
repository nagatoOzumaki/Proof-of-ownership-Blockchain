// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ImageStorage {
    // Structure to represent an image
    struct Image {
        address owner;          // Ethereum address of the image owner
        string imageHash;       // Hash of the image content (changed to string)
        uint256 timestamp;      // Timestamp when the image was recorded
    }

    // Mapping from image hash to Image struct
    mapping(string => Image) public images;

    // Event emitted when a new image is added
    event ImageAdded(address indexed owner, string indexed imageHash, uint256 timestamp);

    // Function to add a new image to the blockchain
    function addImage(string memory _imageHash) external {
        // Check if an image already exists for the given hash
        require(bytes(images[_imageHash].imageHash).length == 0, "Image already exists");

        // Record the image details
        images[_imageHash] = Image({
            owner: msg.sender,
            imageHash: _imageHash,
            timestamp: block.timestamp
        });

        // Emit an event
        emit ImageAdded(msg.sender, _imageHash, block.timestamp);
    }

    // Function to get image details
    function getImageDetails(string memory _imageHash) external view returns (address owner, uint256 timestamp) {
        Image storage image = images[_imageHash];
        require(bytes(image.imageHash).length > 0, "Image does not exist for the given hash");
        return (image.owner, image.timestamp);
    }

    // Additional functions can be added for features like transferring ownership, revoking access, etc.
}
