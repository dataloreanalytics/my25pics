
var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('user_photos');
provider.addScope('user_friends');
firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
   var token = result.credential.accessToken;
   // The signed-in user info.
   var user = result.user;
   var userId = user.uid;
   console.log(userId);
   // ...
   // Get a reference to the database service
   var database = firebase.database();
   addOrderCID(userId);
}).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // The email of the user's account used.
   var email = error.email;
   // The firebase.auth.AuthCredential type that was used.
   var credential = error.credential;
   // ...
});

function addOrderCID(userId){
   var monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"];
   var today = new Date();
   var dd = today.getDate();
   var mm = monthNames[today.getMonth()]; //January is 0!
   var yyyy = today.getFullYear();
   var min = today.getMinutes();
   var hh = today.getHours();
   var orderDate = yyyy + '/' + mm + '/' + dd;
   var orderId = userId + yyyy + today.getMonth() + dd;
   firebase.database().ref('orders/' + orderDate + '/' + userId ).set({
      'cid' : orderId,
   });

   // Get a key for a new Post.
   var newPostKey = firebase.database().ref().child('orders/' + orderDate + '/' + userId).update({
      'cid' : orderId,
   });

   // Write the new post's data simultaneously in the posts list and the user's post list.
   // var updates = {};
   // updates['/posts/' + newPostKey] = postData;
   // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
   //
   // return firebase.database().ref().update(updates);
}
