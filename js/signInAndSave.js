function signInAndSave(){
   var provider = new firebase.auth.FacebookAuthProvider();
   provider.addScope('user_photos');
   provider.addScope('user_friends');
   provider.addScope('user_posts');
   provider.addScope('user_likes');
   firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      var userId = user.uid;
      // Get a reference to the database service
      var database = firebase.database();
      FB.api(
         '/me/',
         'GET',
         {
            "fields":"id,name,email,albums.limit(999999){name,count,id,location,description,photos.limit(999999){id,created_time,name,images,likes.limit(999999)}}",
            "access_token" : token
         },
         function(response) {
            console.log(response);
            var imgThumbnails = $("#imgThumbnails"); //reference to #imgThumbnails on the webpage.
            var img_row = $(".img-row"); //reference to .img-row on the page.
            var step2 = $("#step2"); //reference to #step2 on the webpage
            var name = response.name;
            var allPhotos = getPhotosFromAlbum(response.albums.data);
            var sortedPhotos = _.sortBy( allPhotos, 'likes' ).reverse();
            var top_25 = [];
            //step2.html("Step 2 : ");
            //var stepText = "<p>This is a simple step, look and appreciate all your pictures after all they are your most liked 25 pictures.</p>";
            //$(stepText).insertAfter(step2);
            for(i = 0; i< sortedPhotos.length && i < 25 ; i++){
               var thumbNail = sortedPhotos[i].images[sortedPhotos[i].images.length - 2].source;
               // var thumbNail = sortedPhotos[i].images[2].source;
               var highResImg = sortedPhotos[i].images[0].source;
               var name = sortedPhotos[i].name;
               var div_col = '<div class="col-md-2 ">';
               var a =  '<a href=\"' + highResImg + '\"  data-title=\"'+  name + '\" data-lightbox=\"top25pics\">';
               var img = '<img  src=\"' + thumbNail + '\" alt='+ '"' + name  + '" ' +' class="thumbnail img-responsive" height="200px"> </a> </div>';
               var append = div_col + a + img;
               if(i < 5){
                  img_row.eq(0).append(append);
               } else if ( i > 4 && i < 10){
                  img_row.eq(1).append(append);
               } else if ( i > 9 && i < 15){
                  img_row.eq(2).append(append);
               } else if ( i > 14 && i < 20){
                  img_row.eq(3).append(append);
               } else if ( i > 19 && i < 25){
                  img_row.eq(4).append(append);
               }
               // imgThumbnails.append(append).fadeIn(3000);
               top_25.push(sortedPhotos[i]);
            }
            writeUserData(userId, response, top_25) ;
            $("#loginRow").fadeOut(200);
            $("#logoutRow").fadeIn(1000);
            //generateOrder(userId, top_25);
            // createAlertDiv("Succesfully logged in", true);
            var checkout = $("#checkout");
            checkout.fadeIn(1500);
         }

      );
   }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(email);
      logErrorsOnDB(error);
      createAlertDiv("It seems like your Pop-up Blocker is enabled. Please add this site to your exception list, and try again.", false);

   });
}

function createAlertDiv(message, isSuccess){
   var alert = $("#alert");
   alert.empty();
   var divType;
   if(isSuccess){
      divType = '<div class="alert alert-success">'+ message +'</div>';
   } else{
      divType = '<div class="alert alert-danger">'+ message +'</div>';
   }
   alert.append(divType);
   $("#alertRow").fadeIn(1000);
   $("#alertRow").fadeOut(6000);
}

function getPhotosFromAlbum(allAlbum){
   var allPhotos = [], count = 0 ;
   for(var i = 0; i < allAlbum.length; i++){
      if( "photos" in allAlbum[i]){
         for(var j = 0; j < allAlbum[i].photos.data.length; j++){
            var photo = allAlbum[i].photos.data[j];
            var photoObj;
            var likes = 0;
            var name = "";
            if( "likes" in photo){
               likes = (photo.likes.data.length);
            }
            if( "name" in photo){
               name = photo.name;
            }
            photo.likes = likes;
            photo.name = name;
            photoObj = {
               'created_time' : photo.created_time,
               'photo_id'	   : photo.id,
               'images'       : photo.images,
               'likes'        : photo.likes,
               'name'         : photo.name,
            }
            allPhotos.push(photoObj);
         }
      }
   }
   return allPhotos;
}


function logout(){
   firebase.auth().signOut().then(function() {
      var img_row = $(".img-row");
      $("#logoutRow").fadeOut(200);
      $("#loginRow").fadeIn(5000);
      createAlertDiv("You have been logged out. Thank you for using my25pics.", true);
      for( var i = 0; i < img_row.length; i++){
         img_row.eq(i).empty();
      }
      var step2 = $("#step2");
      // step2..empty();
   }, function(error) {
      // An error happened.
      createAlertDiv("Uh-oh. . . There was a problem logging out. Please try again.", false);
   });
}

function writeUserData(userId, response, top_25_pics) {
   var topPicsDate = getTopPicsDate();
   var topPics = {};
   topPics[topPicsDate] = top_25_pics;
   var user = firebase.auth().currentUser;
   var name, email;
   if(user != null){
      name = user.displayName;
      email = user.email;
   }
   firebase.database().ref('users/'+ getTodayDatePath() + '/' + userId).set({
      'name'      : response.name,
      'albums'    : (response.albums.data),
      '25pictures' : (topPics),
      'email'     : response.email,
   });
}

function logErrorsOnDB(error){
   var today = new Date();
   var date = getTodayDatePath();
   var hh = today.getHours();
   var ss = today.getSeconds();
   var errorDate = date + '/' + hh + '/' + min + '_' + ss ;
   firebase.database().ref('errors/' + errorDate).set({
      'error' : error,
   });
}
function generateOrder(){
   var user = firebase.auth().currentUser;
   var name, email, uid;
   if(user != null){
      name = user.displayName;
      email = user.email;
      uid  = user.uid;
   }
   // console.log(user);
   console.log(firebase.database().ref('users/'  + getTodayDatePath + '/' + uid + '/' + '25pictures' + getTopPicsDate()).value());

}

function generateOrderOnDb(userId, top25pics){
   var orderDate = getTodayDatePath();
   var orderId = userId + yyyy + today.getMonth() + dd;
   var user = firebase.auth().currentUser;
   var name, email;
   if(user != null){
      name = user.displayName;
      email = user.email;
   }
   firebase.database().ref('orders/' + orderDate + '/' + userId).set({
      'pictures' : top25pics,
      'name' : name,
      'email': email,
   });
}

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

function getTopPicsDate(){
   var today = new Date();
   var dd = today.getDate();
   var mm = getMonthNames(today.getMonth());
   var yyyy = today.getFullYear();
   var topPicsDate = yyyy + '_' + mm + '_' + dd;
   return topPicsDate;
}
function getMonthNames(month){
   var monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"];
   return monthNames[month];
}
