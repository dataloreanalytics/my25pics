
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

function getAlbumPhotos(albumid){
   FB.api("/"+albumid+"/photos",function(response){
      var photos = response["data"];
      var html = "count "+photos.length;
      for(var i=0;i<photos.length;i++) {
         var images = photos[i]["images"];
         html+= "Photo "+(v+1);
         html+= '<img src="'+images[(images.length-1)]["source"]+'" />';
         var tmp = "";
         for(var j = 0 ;j<images.length;j++) {
            tmp+= '<a href="'+images[j]["source"]+'"> size : '+images[j]["width"]+"X"+images[j]["height"]+'</a><br />';
         }
         html+=temp+"<hr />";
      }
      document.getElementById("photos").innerHTML = html;
   });

}
function getAlbums(){
   document.getElementById("albums").innerHTML="yukleniyor...";
   FB.api('/me/albums',  function(resp) {
      var html="<ul>";
      for (var i=0, l=resp.data.length; i<l; i++){
         var album = resp.data[i];
         html+=  '<li><a href="#" onclick="getAlbumPhotos(\''+album.id+'\')">get photos</a> <a href="'
         +album.link+'">'+album.name+'</a><li>';

      }
      html+="</ul>";
      document.getElementById("albums").innerHTML=html;
   });
};
