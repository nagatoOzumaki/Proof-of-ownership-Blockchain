// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/ImageStorage.sol";
// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract ImageStorageTest {

    function testAddImage() public {
        ImageStorage imageStorage = ImageStorage(DeployedAddresses.ImageStorage());

        uint256 intValue = 291;
        (address ownerBefore, uint256 timestampBefore) = imageStorage.getImageDetails(intValue);
        Assert.equal(ownerBefore, address(0), "Image should not exist before adding");

        // Add a new image
        imageStorage.addImage(intValue);

        (address ownerAfter, uint256 timestampAfter) = imageStorage.getImageDetails(intValue);
        Assert.equal(ownerAfter, address(this), "Owner should be the test contract");
        Assert.isAbove(timestampAfter, timestampBefore, "Timestamp should be greater after adding");
    }
}
