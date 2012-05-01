$('#fileSelect').change(function (evt) {
    new Arena.CreateArena(evt.target);
});

var Arena = {elementName:"surface"};

Arena.CreateArena = function (imageList) {

    var onReaderLoad = function (theFile) {
        return function (e) {

            var computeRatio = function (image) {
                var canvas = document.getElementById(Arena.elementName).children[0];
                var widthRatio = canvas.width / image.width;
                var heightRatio = canvas.height / image.height;
                return Math.min(Math.min(widthRatio, heightRatio), 1);
            };

            var img = new Image();
            var onImageLoad = function () {
                var ratio = computeRatio(img);
                var imageEntity = new Arena.Image(img, ratio);
                Arena.gs.addEntity(imageEntity);

                var rect = new Arena.Rectangle(ratio, 50, 30, 25, 15);
                Arena.gs.addEntity(rect);

                var circle = new Arena.Circle(ratio, 100, 100, 50);
                Arena.gs.addEntity(circle);
            };

            img.onload = onImageLoad;
            img.src = e.target.result;
        };
    };

    var file = imageList.files[0];

    if (Arena.gs) {
        Arena.gs.clearEntities();
    } else {
        Arena.gs = new JSGameSoup(Arena.elementName, 20);
        Arena.gs.launch();
    }
    ;

    var reader = new FileReader();
    reader.onload = onReaderLoad(file);

    reader.readAsDataURL(file);

};

Arena.Image = function (imageSource, ratio) {
    var image = imageSource;
    //    this.update = function (){
    //
    //    };

    this.draw = function (c) {
        c.scale(ratio, ratio);
        c.drawImage(image, 0, 0);
    };
}

Arena.Shape = function (ratio, x, y) {
    this.posX = x;
    this.posY = y;
    this.ratio = ratio;
};

Arena.Shape.prototype.getCenter = function () {
    return {x:this.posX, y:this.posY};
};

Arena.Circle = function (ratio, x, y, r) {
    Arena.Shape.call(this, ratio, x, y);
    this.radius = r;
};

Arena.Circle.prototype.draw = function (c) {
    c.scale(this.ratio);
    c.strokeStyle = "black";
    c.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    c.stroke();
};

Arena.Rectangle = function (ratio, x, y, halfWidth, halfHeight) {
    Arena.Shape.call(this, ratio, x, y);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
};

Arena.Rectangle.prototype.draw = function (c) {
    c.scale(this.ratio);
    c.strokeStyle = "black";
    c.strokeRect(this.posX - this.halfWidth, this.posY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
};


