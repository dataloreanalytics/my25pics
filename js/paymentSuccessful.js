
var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('user_photos');
provider.addScope('user_friends');
firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
   var token = result.credential.accessToken;
   // The signed-in user info.
   var user = result.user;
   console.log(user);
   // ...
   // Get a reference to the database service
   var database = firebase.database();
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

function orderId(userId, top25pics){
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
   var checkout = $("#checkout");

   var link="https://app.moonclerk.com/pay/gkq6vcpdo5p?cid=" + orderId;
   var moonclerk = '<a href="' + link + '"'  + 'class="btn btn-warning" role="button">Checkout my 25 pics</a>';
   checkout.append(moonclerk);
   firebase.database().ref('orders/' + orderDate).set({
      'cid' : orderId,
      'pictures' : top25pics,
   });
}
