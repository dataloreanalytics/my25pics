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
                  // var
                  if( "likes" in getLikesResponse){
                     // getLikesResponse.likes = data;
                     likes = getLikesResponse.likes.data.length;
                     // console.log(getLikesResponse.likes.data.length);
                  }
                  console.log(allPhotos.length);
                  allPhotos.push({
                     "created_time" : getLikesResponse.created_time,
                     "id"           : getLikesResponse.id,
                     "album"        : getLikesResponse.album,
                     "name"         : getLikesResponse.name,
                     "images"       : getLikesResponse.images,
                     "likes"        : likes,
                     "image_number" : allPhotos.length,
                  });
                  // console.log(allPhotos.length);
                  // if(allPhotos.length == 617){
                  //    var balh = JSON.parse(JSON.stringify(allPhotos[616]));
                  //    console.log(balh);
                  // }
                  // console.log(getLikesResponse.likes.data.length);
               });
            }
            deferreds[albumId].resolve();
         });
         // console.log("In get all likes : " + allPhotos.length);

      }
      // console.log("In get all likes : ");
      // console.log(allPhotos);
      $.when.apply($, listOfDeferreds ).then( function() {
         if (callback) {
            // console.log("In Apply : " + allPhotos.length);
            // console.log(allPhotos);
            callback( allPhotos );
         }
      }, function( error ) {
         if (callback) {
            callback( allPhotos, error );
         }
      });
   });
}
