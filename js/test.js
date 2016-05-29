'<a href="img/3.jpg" title="Two men and a wall" data-gallery> <img src="img/3.jpg" alt="Banana"> </a>'

function test(){
   var div = $("#links");
   var images = ["\"img/1.jpg\"", "\"img/3.jpg\"", "\"img/3.jpg\""];
   for(var i = 0; i < 3; i++){
      var a =  '<a href=' + images[i] +  'title="Tests" data-gallery> ';
      var img = '<img src=' + images[i] + 'alt="Testa"> </a>'
      var append = a + img;
      var append = append;
      div.append(append);
   }
}
