// function login(){
//    var provider = new firebase.auth.FacebookAuthProvider();
//    provider.addScope('user_photos');
//    provider.addScope('user_friends');
//    firebase.auth().signInWithPopup(provider).then(function(result) {
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       var token = result.credential.accessToken;
//       console.log(token);
//       // The signed-in user info.
//
//       var user = result.user;
//       console.log(user);
//       var currentUser = firebase.auth().currentUser;
//       console.log(currentUser);
//
//       if (user != null) {
//          user.providerData.forEach(function (profile) {
//             console.log("Sign-in provider: "+profile.providerId);
//             console.log("  Provider-specific UID: "+profile.uid);
//             console.log("  Name: "+profile.displayName);
//             console.log("  Email: "+profile.email);
//             console.log("  Photo URL: "+profile.photoURL);
//             var uid = profile.uid;
//             setTimeout(
//                FB.api(
//                   '/me/',
//                   'GET',
//                   {"fields":"albums.limit(999999){name,count,id,photos.limit(999999){id,created_time,name,images,likes.limit(999999)}}, first_name, last_name","limit":"999999"},
//                   function(response) {
//                      // Insert your code here
//                      console.log(response);
//                   }
//                ), 4000 )
//             });
//          }
//       }).catch(function(error) {
//          // Handle Errors here.
//          var errorCode = error.code;
//          var errorMessage = error.message;
//          // The email of the user's account used.
//          var email = error.email;
//          // The firebase.auth.AuthCredential type that was used.
//          var credential = error.credential;
//          // ...
//       });
//
//    }
function blah(){
   FB.api(
      '/me/', 'GET', {},
      function(response){
         console.log(response);
      }
   );
}
