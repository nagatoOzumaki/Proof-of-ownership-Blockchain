const ImageStorage = artifacts.require("ImageStorage");

contract('ImageStorage', (accounts) => {
  it('should add a new image and get its details', async () => {
    const imageStorageInstance = await ImageStorage.deployed();

    // Initial state check
    const initialValue = 123;

    // Check if the image exists before adding
    const initialImageBefore = await imageStorageInstance.getImageDetails(initialValue);
    console.log("Initial Image Before:", initialImageBefore);

    assert.equal(initialImageBefore.owner, "0x0000000000000000000000000000000000000000", "Image should not exist initially");

    // Add a new image
    await imageStorageInstance.addImage(initialValue);

    // Check the updated state
    const initialImageAfter = await imageStorageInstance.getImageDetails(initialValue);
    console.log("Initial Image After:", initialImageAfter);

    assert.equal(initialImageAfter.owner, accounts[0], "Owner should be the test contract");

    // Additional check to ensure the image owner is not address(0)
    assert.notEqual(initialImageAfter.owner, "0x0000000000000000000000000000000000000000", "Owner should not be address(0)");
  });
});
