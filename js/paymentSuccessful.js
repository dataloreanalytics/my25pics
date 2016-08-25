firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var userId = user.uid;
    var orderDate = getTodayDatePath();
    firebase.database().ref('orders/' + orderDate + '/' + userId).set({
      'paid' : "true",
      'test' : 'test',
   });
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
