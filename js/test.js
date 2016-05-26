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

function getPhotos(albumId, callback){
   FB.api(
      '/'+ albumId + '/photos/',
      'GET',
      {"fields":"created_time,id,height,images,width,name","limit":"9999"},
      function(response) {
         callback( albumId, response);
      }
   );
}

function getLikes(photoId, callback){
   FB.api(
      '/'+ photoId +'/',
      'GET',
      {"fields":"likes.limit(9999){name},images,created_time,height,width,id,name, album"},
      function(response) {
         callback(photoId, response);
      }
   );
}

function getAlbums(callback){
   FB.login(function(loginResponse){
      if( loginResponse.status === 'connected'){
         FB.api(
            '/me/albums/',
            'GET',
            {"fields":"name,count,id,created_time","limit":"9999"},
            function(albumsResponse) {
               callback(albumsResponse);
            }
         );
      }
   }, {scope: 'public_profile,user_photos,user_likes'});
}

function getAllLikes(callback){
   getAlbums(function(getAlbumsResponse){
      // console.log(getAlbumsResponse.data.length);
      var allPhotos = [];
      var album, deferreds = {}, listOfDeferreds = [], photo;
      for(var i = 0; i < getAlbumsResponse.data.length; i++){
         // console.log(getAlbumsResponse.data[i]);
         album = getAlbumsResponse.data[i];
         deferreds[album.id] = $.Deferred();
         listOfDeferreds.push( deferreds[album.id] );
         getPhotos(getAlbumsResponse.data[i].id, function(albumId,getPhotosResponse){
            // console.log(getPhotosResponse);
            // console.log(getPhotosResponse.data.length);
            for(var j = 0; j < getPhotosResponse.data.length; j++){
               // console.log(getPhotosResponse.data[j].id);
               photo = getPhotosResponse.data;
               deferreds[photo.id] = $.Deferred();
               listOfDeferreds.push( deferreds[photo.id] );
               getLikes(getPhotosResponse.data[j].id, function(photoId, getLikesResponse){
                  // console.log(getLikesResponse);
                  var likes = 0;
                  if( "likes" in getLikesResponse){
                     // getLikesResponse.likes = data;
                     likes = getLikesResponse.likes.data.length;
                     // console.log(getLikesResponse.likes.data.length);
                  }
                  allPhotos.push({
                     "created_time" : getLikesResponse.created_time,
                     "id"           : getLikesResponse.id,
                     "album"        : getLikesResponse.album,
                     "height"       : getLikesResponse.height,
                     "width"        : getLikesResponse.width,
                     "name"         : getLikesResponse.name,
                     "images"       : getLikesResponse.images,
                     "likes"        : likes,
                  });
                  // console.log(allPhotos.length);
                  // if(allPhotos.length == 617){
                  //    var balh = JSON.parse(JSON.stringify(allPhotos[616]));
                  //    console.log(balh);
                  // }
                  // console.log(getLikesResponse.likes.data.length);
                  deferreds[photoId].resolve();
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
}

function login(){
   getAllLikes(function(allLikesResponse){
      console.log(allLikesResponse);
   })
}
