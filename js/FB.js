var fbUnauth = $("#FBUnauthorized");
var fbAuth = $("#FBAuthorized");
var printButton = $("#printButton");
var userName = $("#userName");
var tAndC = $("#termsAndConditionsText");
var loginButton = $("#loginButton");
var helloText = "Hello ";
var questionText = ", lets get printing.";
var tAncDText = "Its simple just hit the print button and you should be good to go. Make sure to the read <a>Terms and Conditions</a>."

function picture( height, width, url){
   this.height = height;
   this.width = width;
   this.url = url;
}

var allPhotos = [];

window.fbAsyncInit = function() {
   FB.init({
      appId      : '800212700114821',
      xfbml      : true,
      status : true, // check login status
      cookie : true, // enable cookies to allow the server to access the session
      version    : 'v2.6'
   });

   FB.getLoginStatus(function(response){
      if( response.status === 'connected'){
         console.log("Connected");
         connected();
      } else if (response.status === 'not_authorized'){
         console.log("not authorized");
         not_authorized();
      } else{
         alert("DUDE");
      }
   });

};


function getName(){
   console.log("getName ->");
   var name;
   FB.api('/me', function(response) {
      $(userName).html(helloText + response.name + questionText);
      $(tAndC).html(tAncDText);
      $(loginButton).toggle();
      $(printButton).toggle();
   });
}

function connected(){
   console.log("connected() ->");
   getName();
   // alert(getName());
   fbAuth.toggle();
   getImages();
   // alert("connected");
}

function not_authorized(){
   console.log("not_authorized ->");
   console.log("not connected function called");
   alert("not auth");
}

function login(){
   console.log("login() ->");
   FB.login(function(response){
      if( response.status === 'connected'){
         console.log("Connected");
         connected();
      } else if (response.status === 'not_authorized'){
         console.log("not authorized");
         not_authorized();
      } else{
         alert("DUDE");
      }
   });
}

function makeFacebookPhotoURL( id, accessToken ) {
   console.log("makeFacebookPhotoURL() ->");
   return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
}

function getAlbums( callback ) {
   console.log("getAlbums() ->");
   FB.api(
      '/me/albums',
      {fields: 'id,cover_photo'},
      function(albumResponse) {
         console.log( 'got albums ' );
         console.log(albumResponse);
         if (callback) {
            callback(albumResponse);
         }
      }
   );
}

function getPhotosForAlbumId( albumId, callback ) {
   console.log("getPhotosForAlbumId() ->");
   FB.api(
      '/'+albumId+'/photos',
      {fields: 'id'},
      function(albumPhotosResponse) {
         console.log( 'got photos for album ' + albumId );
         if (callback) {
            callback( albumId, albumPhotosResponse );
         }
      }
   );
}

function getLikesForPhotoId( photoId, callback ) {
   console.log("getLikesForPhotoId() ->");
   FB.api(
      '/'+albumId+'/photos/'+photoId+'/likes',
      {},
      function(photoLikesResponse) {
         if (callback) {
            callback( photoId, photoLikesResponse );
         }
      }
   );
}

function getImages(){
   console.log("getImages() ->");
   FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
         accessToken = response.authResponse.accessToken || '';
         console.log(response.authResponse.accessToken);
         // Start Normal API
         FB.api('/me/albums', function(response)
         {
            console.log("Checking for albums");
            var d = response.data;
            console.log( d.length);
            for (var i = 0, l = d.length; i < l; i++)
            {
               addOption(response["data"][i].name,response["data"][i].id);
               counter++;
            }
         });
         //end of  Normal API
      }
   },{scope:'read_stream,publish_stream,offline_access,user_photos,friends_photos,user_photo_video_tags,friends_photo_video_tags'});
}
