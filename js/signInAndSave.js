function signInAndSave(){
   var provider = new firebase.auth.FacebookAuthProvider();
   provider.addScope('user_photos');
   provider.addScope('user_friends');
   firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      var userId = user.uid;
      // FB.api(
      //    '/me/albums', {access_token: token}, function(response) {
      //       console.log(response);
      //    }
      // );
      // ...
      // Get a reference to the database service
      var database = firebase.database();
      var fields = 'id,name,albums.limit(999999){name,count,id,location,description,photos.limit(999999){id,created_time,name,images,likes.limit(999999)}}'
      $.get(
         "https://graph.facebook.com/me",
         {
            'fields'       : fields,
            'access_token' : token
         },
         function(response) {
            var imgThumbnails = $("#imgThumbnails");
            imgThumbnails.empty();
            var name = response.name;
            var allPhotos = getPhotosFromAlbum(response.albums.data);
            var sortedPhotos = _.sortBy( allPhotos, 'likes' ).reverse();
            var top_25 = [];
            for(i = 0; i< sortedPhotos.length && i < 25 ; i++){
               // var thumbNail = sortedPhotos[i].images[sortedPhotos[i].images.length - 2].source;
               var thumbNail = sortedPhotos[i].images[2].source;
               var highResImg = sortedPhotos[i].images[0].source;
               var name = sortedPhotos[i].name;
               // <div class="col-lg-3 col-md-4 col-xs-6 thumb">
               //     <a class="thumbnail" href="#">
               //         <img class="img-responsive" src="http://placehold.it/400x300" alt="">
               //     </a>
               // </div>
               var div_col = '<div class="col-lg-3 col-md-4 col-xs-6 thumb">';
               var a =  '<a href=\"' + highResImg +  '\" title='+ '"' + name  + '" ' +'>';
               var img = '<img  src=\"' + thumbNail + '\" alt='+ '"' + name  + '" ' +' class="img-responsive"> </a> </div>';
               var append;
               if(i == 0 || i == 4 || i == 9 || i == 14 || i == 19 || i == 24){
                  var div_row = '<div class="row>"'
                  append = div_row + div_col + a + img;
               } else if(i == 5 || i == 10 || i == 15 || i == 20 || i == 25){
                  var div_col = '</div> <div class="col-lg-3 col-md-4 col-xs-6 thumb">';
                  var append = div_col + a + img;
               } else {
                  var append = div_col + a + img;
               }
               imgThumbnails.append(append).fadeIn(3000);
               top_25.push(sortedPhotos[i]);
            }
            writeUserData(userId, response, top_25) ;
            $("#loginRow").fadeOut(200);
            $("#logoutRow").fadeIn(5000);
            createAlertDiv("Succesfully logged in", true);
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
      createAlertDiv("Uh-oh There was a problem loggin in. Please try again", false);

   });
}

function createAlertDiv(message, isSuccess){
   var alert = $("#alert");
   alert.empty();
   var divType
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
      var links = $("#links");
      links.empty();
      $("#logoutRow").fadeOut(200);
      $("#loginRow").fadeIn(5000);
      createAlertDiv("You have been logged out. Thank you for using my25pics.", true);

   }, function(error) {
      // An error happened.
      createAlertDiv("Uh-oh. . . There was a problem logging out. Please try again.", false);
   });
}

function parseAlbumArrayToJSON(albumsData){
   for(var i = 0; i < albumsData.length; i++){

   }
}

function writeUserData(userId, response, top_25_pics) {
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth()+1; //January is 0!
   var yyyy = today.getFullYear();
   var topPicsDate = yyyy + '_' + mm + '_' + dd + '_top_25';
   var topPics = {};
   topPics[topPicsDate] = top_25_pics;
   firebase.database().ref('users/' + userId).set({
      'name'      : response.name,
      'albums'    : (response.albums.data),
      '25pictures' : (topPics),
   });
}
