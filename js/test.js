// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();
// Create a child reference
var imagesRef = storageRef.child('images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
var spaceRef = storageRef.child('img/1.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"
