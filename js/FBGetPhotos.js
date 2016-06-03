function getAllPhotosAndLikes(callback){
   FB.login(function(loginResponse){
      if( loginResponse.status === 'connected'){
         FB.api(
            '/me/',
            'GET',
            {"fields":"albums.limit(999999){name,count,id,photos.limit(999999){id,created_time,name,images,likes.limit(999999)}}, first_name, last_name","limit":"999999"},
            function(response) {
               console.log(response);
               callback(response);
            }
         );
      }
   }, {scope: 'public_profile,user_photos,user_likes'});
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


function login(){
   getAllPhotosAndLikes(function(response){
      var imagesDiv = $("#links");
      var userInfoDiv = $("#userInfo");
      imagesDiv.empty();
      userInfoDiv.empty();
      console.log(response.albums.data.length);
      console.log(response.albums);
      var name = response.first_name + " " + response.last_name;
      userInfoDiv.append('<h2>Hello ' + name + '.')
      var allPhotos = getPhotosFromAlbum(response.albums.data);
      var sortedPhotos = _.sortBy( allPhotos, 'likes' ).reverse();
      for(i = 0; i< sortedPhotos.length && i < 25 ; i++){
         var thumbNail = sortedPhotos[i].images[sortedPhotos[i].images.length - 1].source;
         var highResImg = sortedPhotos[i].images[0].source;
         var name = sortedPhotos[i].name;
         console.log(sortedPhotos[i]);
         var a =  '<a href=\"' + highResImg +  '\" title='+ '"' + name  + '" ' +'data-gallery> ';
         var img = '<img src=\"' + thumbNail + '\" alt='+ '"' + name  + '" ' +'> </a>';
         var append = a + img;
         var append = append;
         imagesDiv.append(append).fadeIn(3000);
      }
      setTimeout(function(){
         $('#FBAuthorized').fadeIn();
      }, 100);

   });
}
