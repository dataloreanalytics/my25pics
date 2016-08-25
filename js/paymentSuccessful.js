firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
      // User is signed in.
      var userId = user.uid;
      var orderDate = getTodayDatePath();
      // firebase.database().ref('orders/' + orderDate + '/' + userId ).set({
      //    'paid' : "true",
      // });

      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('orders/' + orderDate + '/' + userId + '/paid').push().key;
      console.log(newPostKey);
      // Write the new post's data simultaneously in the posts list and the user's post list.
      // var updates = {};
      updates['orders/' + orderDate + '/' + userId + '/paid'] = "true";
      // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
      //
      firebase.database().ref().update(updates);
   } else {
      // No user is signed in.
      console.log("not logged in");
   }
});

function getTodayDatePath(){
   var today = new Date();
   var dd = today.getDate();
   var mm = getMonthNames(today.getMonth()); //January is 0!
   var yyyy = today.getFullYear();
   var min = today.getMinutes();
   var hh = today.getHours();
   var orderDate = yyyy + '/' + mm + '/' + dd;
   return orderDate;
}
function getMonthNames(month){
   var monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"];
   return monthNames[month];
}
