function getAllPhotosAndLikes(callback){
   FB.login(function(loginResponse){
      if( loginResponse.status === 'connected'){
         FB.api(
            '/me/',
            'GET',
            {"fields":"albums.limit(999999){name,count,id,photos.limit(999999){id,created_time,name,images,likes.limit(999999)}}","limit":"999999"},
            function(response) {
               // Insert your code here
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
            // console.log(allAlbum[i].photos.data[j]);
            var photo = allAlbum[i].photos.data[j];
            var photoObj;
            // console.log(photo);
            // console.log(photo.created_time);
            // console.log(photo.id);
            // console.log(photo.images);
            // allPhotos.push
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
            // console.log(photo.likes);
            // console.log(photo.name);
            photoObj = {
               'created_time' : photo.created_time,
               'photo_id'	   : photo.id,
               'images'       : photo.images,
               'likes'        : photo.likes,
               'name'         : photo.name,
            }
            allPhotos.push(photoObj);
            // console.log(allPhotos.length);
         }
      }
   }
   return allPhotos;
}


function login(){
   getAllPhotosAndLikes(function(response){

      // var top_25_img = $('.top-25-img');
      // var top_25_lbox = $('.top-25-lbox');
      var div = $("#links");
      // setTimeout(function(){
      //
      //    // console.log(JSON.stringify(response));
      // }, 1000);

      console.log(response.albums.data.length);
      console.log(response.albums);
      var allPhotos = getPhotosFromAlbum(response.albums.data);
      // console.log(allPhotos);
      // console.log(allPhotos[2]);
      // console.log(allPhotos[3]);
      // console.log(JSON.stringify(allPhotos[1]));
      var sortedPhotos = _.sortBy( allPhotos, 'likes' ).reverse();
      // console.log(sortedPhotos);
      // console.log(sortedPhotos);
      for(i = 0; i< sortedPhotos.length && i < 25 ; i++){
         var thumbNail = sortedPhotos[i].images[sortedPhotos[i].images.length - 1].source;
         var highResImg = sortedPhotos[i].images[0].source;
         var name = sortedPhotos[i].name;
         console.log(name);


         // var images = ["\"img/1.jpg\"", "\"img/3.jpg\"", "\"img/3.jpg\""];
         // for(var i = 0; i < 3; i++){
         var a =  '<a href=' + highResImg +  'title='+ '"' + name  + '" ' +'data-gallery> ';
         var img = '<img src=' + thumbNail + 'alt='+ '"' + name  + '" ' +'> </a>';
         var append = a + img;
         var append = append;
         div.append(append);
         // }
      }
      setTimeout(function(){
         $('#FBAuthorized').fadeIn();
      }, 100);

   });
}
