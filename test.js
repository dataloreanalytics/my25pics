window.fbAsyncInit = function() {
   FB.init({
      appId      : '800212700114821',
      xfbml      : true,
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      version    : 'v2.6'
   });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// function login(){
//    console.log("login() ->");
//    FB.login(function(response){
//       if( response.status === 'connected'){
//          console.log("Connected");
//       } else if (response.status === 'not_authorized'){
//          console.log("not authorized");
//       } else{
//          alert("DUDE");
//       }
//    }, {scope: 'public_profile,user_photos,user_likes'});
// }
function makeFacebookPhotoURL( id, accessToken ) {
   return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
}

function FBLogin(callback){
   FB.login(function(response){
      if( response.status === 'connected'){
         callback(response);
         // console.log("Connected");
      } else if (response.status === 'not_authorized'){
         callback(response);
         // console.log("not authorized");
      } else{
         callback(response);
         // alert("DUDE");
      }
   }, {scope: 'public_profile,user_photos,user_likes'});
}

function getAlbums( callback ) {
   FB.api('/me/albums', {fields: 'id,cover_photo'},
   function(albumResponse) {
      if (callback) {
         callback(albumResponse);
      }
   });
}

function getPhotosForAlbumId( albumId, callback ) {
   FB.api('/'+albumId+'/photos',{fields: 'id, created_time, height, width, images, name'},
   function(albumPhotosResponse) {
      if (callback) {
         callback( albumId, albumPhotosResponse );
      }
   });
}

function getLikesForPhotoId( photo ,callback ) {
   var photoId = photo.photo_id;
   FB.api('/' + photoId+'/likes?limit=999999','GET', {"limit":"99999999"},
   function(photoLikesResponse) {
      if (callback) {
         callback(photo, photoLikesResponse);
      }
   });
}
function getLikesForPhotoId( photoId, callback ) {
   FB.api('/' + photoId+'/likes?limit=999999','GET', {"limit":"99999999"},
      function(photoLikesResponse) {
         if (callback) {
            callback( photoId, photoLikesResponse );
         }
      }
   );
}

function getAllPhotos(callback){
   var allPhotos = [];
   var accessToken = '';
   FBLogin(function(loginResponse){
      accessToken = loginResponse.authResponse.accessToken;
      console.log(loginResponse.authResponse.accessToken);
      var i, album, deferreds = {}, listOfDeferreds = [];
      getAlbums(function(getAlbumsResponse){
         // console.log(getAlbumsResponse.data.length);
         for (i = 0; i < getAlbumsResponse.data.length; i++) {
            album = getAlbumsResponse.data[i];
            deferreds[album.id] = $.Deferred();
            listOfDeferreds.push( deferreds[album.id] );
            getPhotosForAlbumId( album.id, function( albumId, albumPhotosResponse ) {
               var i, facebookPhoto;
               for (i = 0; i < albumPhotosResponse.data.length; i++) {
                  facebookPhoto = albumPhotosResponse.data[i];
                  // console.log('album-id : ' + album.id);
                  // console.log('photo-id : '	+ facebookPhoto.id);
                  // console.log('added : '	+	facebookPhoto.created_time);
                  // console.log('url : '	+	makeFacebookPhotoURL( facebookPhoto.id, accessToken ));

                  var highResImg = facebookPhoto.images[0];
                  var thumbNailImg = facebookPhoto.images[facebookPhoto.images.length - 2];
                  // console.log(facebookPhoto.images);
                  // console.log(thumbNailImg);
                  // getLikesForPhotoId(facebookPhoto.id, function(facebookPhoto.id, ))
                  allPhotos.push({
                     'album_id'  : album.id,
                     'photo_id'	: facebookPhoto.id,
                     'added'	   : facebookPhoto.created_time,
                     'height'    : highResImg.height,
                     'width'     : highResImg.width,
                     'source'	   : highResImg.source,
                     'photo_name': facebookPhoto.name,
                     'thumbnail_source' : thumbNailImg.source,
                     'all_resolution_images' : facebookPhoto.images
                  });
               }
               deferreds[albumId].resolve();
            });

         }
         $.when.apply($, listOfDeferreds ).then( function() {
            if (callback) {
               callback( allPhotos );
            }
         }, function( error ) {
            if (callback) {
               callback( allPhotos, error );
            }
         });
      });
   });
}

function getAllLikes(callback){
   getAllPhotos(function(allPhotosResponse){
      // console.log(allPhotosResponse);
      var deferreds = {}, listOfDeferreds = [];
      var allPhotos = [];

      var allPhotos = allPhotosResponse;
      for(var i = 0; i < allPhotos.length; i++){
         // console.log(allPhotos[i].photo_id);
         // console.log(allPhotos[i].source);
         deferreds[allPhotos[i]] = $.Deferred();
         listOfDeferreds.push( deferreds[allPhotos[i]] );
         getLikesForPhotoId(allPhotos[i], function(photo, likesResponse){
            // var likes = "likes";
            // photo["likes"] = likesResponse.data.length;
            photo.likes = likesResponse.data;
            // console.log(photo);
            console.log(JSON.stringify(photo));
            // console.log("Album id : " + photo.album_id);
            // console.log("Photo id : " + photo.photo_id);
            // console.log("Source : " + photo.source);
            // console.log("Height : " + photo.height);
            // console.log("Width  : " + photo.width);
            // console.log("Likes  : " + photo.likes);
         });
      }
      callback(allPhotos);
      // deferreds[albumId].resolve();
   });

}


function login(){
   getAllLikes(function(allLikesResponse){
      var top_25_img = $('.top-25-img');
      var top_25_lbox = $('.top-25-lbox');
      // console.log(allLikesResponse.length);
      // console.log(allLikesResponse);
      var allPhotos = allLikesResponse;
      console.log(allLikesResponse[1]);
      console.log(JSON.stringify(allLikesResponse[1]));
      var sortedPhotos = [];
      sortedPhotos = _.sortBy( allLikesResponse, "likes" );
      // console.log(sortedPhotos);
      console.log(sortedPhotos.length);
      for(i = 0; i < 25 ; i++){
         // console.log(sortedPhotos[i]);
         top_25_img.eq(i).attr('src', sortedPhotos[i].thumbnail_source);
         top_25_lbox.eq(i).attr('href', sortedPhotos[i].thumbnail_source);
         // console.log(sortedPhotos[i].likes);
         // top_25_img.eq(i).attr('src', allPhotos[i].source);
         // top_25_lbox.eq(i).attr('href', allPhotos[i].source);
         // console.log(allPhotos[i].likes);
         top_25_img.eq(i).fadeIn(2000);
      }
      // for(i = 0; i < 25; i++){
      //    top_25_lbox.eq(i).attr('href', sortedPhotos[i].source);
      // }
      $('#FBAuthorized').fadeIn();
   });
}
// THis is for all photos
// for(i = 0; i < allPhotos.length; i++){
//    getLikesForPhotoId(allPhotos[i].photo_id, function(likesResponse){
//       allPhotos[i].likes = likesResponse.data.length;
//       console.log(allPhotos[i]);
//       // allPhotos[i].likes = likes
//    });
// }

// function myFunction(val, callBack){
//    if(val == 1){
//       callBack(true);
//    }else{
//       callBack(false);
//    }
// }
//
// myFunction(0, function (bool){
//    if(bool){
//       alert("do stuff for when value is true");
//    }else {
//       //this condition is satisfied as 0 passed
//       alert("do stuff for when value is false");
//    }
// });
