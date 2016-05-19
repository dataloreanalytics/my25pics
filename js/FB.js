var fbUnauth = $("#FBUnauthorized");
var fbAuth = $("#FBAuthorized");
var printButton = $("#printButton");
var userName = $("#userName");
var tAndC = $("#termsAndConditionsText");
var loginButton = $("#loginButton");
var helloText = "Hello ";
var questionText = ", lets get printing.";
var linkToDoc = "<a href=\"TermsAndConditions/TermsOfService-my25prints.pdf\">Terms and Conditions</a>."
var tAncDText = "Its simple just hit the print button and you should be good to go. Make sure to the read." + linkToDoc;

function picture( height, width, url){
   this.height = height;
   this.width = width;
   this.url = url;
}

function albums( id, name){
   this.id = id;
   this.name = name;
}

var allPhotos = [];
var allAlbums = [];

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
         console.log("no connecetion");
      }
   });
};

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
   },{scope:'read_stream,publish_stream,offline_access,user_photos,friends_photos,user_photo_video_tags,friends_photo_video_tags'});
}

function connected(){
   console.log("connected() ->");
   getName();
   fbAuth.toggle();
   getAlbums();
   getPhotosForAlbumId();
}

function getName(){
   console.log("getName() ->");
   var name;
   FB.api('/me', function(response) {
      $(userName).html(helloText + response.name + questionText);
      $(tAndC).html(tAncDText);
      $(loginButton).toggle();
      $(printButton).toggle();
   });
}

function addAlbumObject(name, id){
   var album = new albums(id, name);
   allAlbums.push(album);
   console.log(allAlbums.length);
}

function getAlbums(){
   console.log("getAlbums() ->");
   FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
         accessToken = response.authResponse.accessToken || '';
         // console.log(response.authResponse.accessToken);
         // Start Normal API
         FB.api('/me/albums', function(response){
            console.log("Checking for albums");
            var d = response.data;
            for (var i = 0, l = d.length; i < l; i++)
            {
               addAlbumObject(response.data[i].name, response.data[i].id);
            }
         });
      }
   });
   console.log("end of getAlbums() <-");
}

function makeFacebookPhotoURL( id, accessToken ) {
   console.log("makeFacebookPhotoURL() ->");
   return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
}


function getPhotosForAlbumId() {
   console.log("getPhotosForAlbumId() ->");
   console.log("The length is : " + allAlbums.length);
   for( var i = 0; i < allAlbums.length; i++){
      var albumId = albumObj[i].id;
      var name = albumObj[i].name;
      FB.api('/'+albumId+'/photos', function(albumPhotosResponse) {
         console.log( albumPhotosResponse );
         // if (callback) {
         //    callback( albumId, albumPhotosResponse );
         // }
      });
   }
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
