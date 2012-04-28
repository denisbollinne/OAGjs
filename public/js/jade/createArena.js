$('#fileSelect').change(function (evt) {
    new Arena.CreateArena(evt.target);
});

var Arena = {};
Arena.CreateArena = function (imageList) {

    var file = imageList.files[0];

    var gs = new JSGameSoup("surface", 20);

    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            var img = new Image();
            img.onload = function(){
                var imageEntity = new Arena.Image(img);
                gs.addEntity(imageEntity);
                gs.launch();
            };
            img.src =  e.target.result;
        };
    })(file);

    reader.readAsDataURL(file);





}

Arena.Image = function (imageSource) {
    var image = imageSource;
    //    this.update = function (){
    //
    //    };

    this.draw = function (c) {
        c.drawImage(image,0,0);
    };
}

