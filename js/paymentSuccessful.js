firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
      // User is signed in.
      var userId = user.uid;
      console.log(userId);
      var orderDate = getTodayDatePath();
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('orders/' + orderDate + '/' + userId + '/paid').push().key;
         // firebase.database().ref('orders/' + orderDate + '/' + userId).set({
         //    'paid' : "true",
         // });
         var updates = "true";
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
