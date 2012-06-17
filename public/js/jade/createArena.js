$('#fileSelect').change(function (evt) {
    new Arena.CreateArena(evt.target);
});

var Arena = {elementName:"surface"};

Arena.CreateArena = function (imageList) {
    var that = this;

    var hasWhiteSpace = function hasWhiteSpace(s) {
        return /\s/g.test(s);
    };

    $('#btnSave').click(function (evt) {

        var arenaInfo = {boundingBoxes:that.shapeController.getAllBoundingBoxes()};
        arenaInfo.name = $('#labelArenaName')[0].value;
        if (hasWhiteSpace(arenaInfo.name)) {
            console.error('invalid name');
        } else {
            var blah = $('#fileSelect').fileupload({

                                                       success:function (e, data, err) {
                                                           console.log("UPLOAD Successful", e, data);
                                                           //  this.addSuccess(data.result);
                                                       },
                                                       fail:function (e, data) {
                                                           console.log("UPLOAD failed", e, data);
                                                           //  console.log("Fail");
                                                       }


                                                   }).fileupload('send', {
                                                                     files:imageList.files,
                                                                     url:'/arenas/create',
                                                                     formData:{data:JSON.stringify(arenaInfo)}
                                                                 });
        }
    });

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

                that.shapeController = new Arena.ShapeController(ratio);

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

Arena.ShapeController = function (ratio) {
    var canvas = document.getElementById(Arena.elementName).children[0];
    var hammer = new Hammer(canvas);

    var allShapes = {};
    var buildingShape;

    var createSequence = function () {
        this.id = 1;
        this.get = function () {
            return this.id++;
        }
    }
    var sequence = new createSequence();

    hammer.ondragstart = function (ev) {
        if (ev.originalEvent.ctrlKey) {
            buildingShape = new Arena.Rectangle(sequence.get(), ratio, ev.position.x, ev.position.y, 1, 1);
        } else {
            buildingShape = new Arena.Circle(sequence.get(), ratio, ev.position.x, ev.position.y, 1);
        }

        Arena.gs.addEntity(buildingShape);
    };

    hammer.ondrag = function (ev) {
        if (buildingShape.getType() == 'rectangle') {
            buildingShape.halfWidth = Math.abs(ev.position.x - buildingShape.posX);
            buildingShape.halfHeight = Math.abs(ev.position.y - buildingShape.posY);
        } else {
            buildingShape.radius = Math.sqrt(Math.pow(ev.position.x - buildingShape.posX,
                                                      2) + Math.pow(ev.position.y - buildingShape.posY, 2));
        }
    };

    hammer.ondragend = function (p) {
        allShapes[buildingShape.getID()] = buildingShape;
        $('#boudingBoxesList').append('<li id="' + buildingShape.getID() + '">' + buildingShape + ' <a href="#" shape=' + buildingShape.getID() + '>Remove</a></li>');

        $('#boudingBoxesList li a').click(function () {
            var clickedShapeId = $(this).attr('shape');
            var clickedShape = allShapes[clickedShapeId];
            Arena.gs.delEntity(clickedShape);
            $('#' + clickedShapeId).remove();
        });
    };

    this.getAllBoundingBoxes = function () {
        var allBoudingBoxes = [];
        for (var shapeId in allShapes) {
            allBoudingBoxes.push(allShapes[shapeId].getBoundingBox());
        }

        return allBoudingBoxes;
    }
};

Arena.Image = function (imageSource, ratio) {
    var image = imageSource;

    this.draw = function (c) {
        c.scale(ratio, ratio);
        c.drawImage(image, 0, 0);
    };
};

Arena.Shape = function (id, type, ratio, x, y) {
    this.posX = x;
    this.posY = y;
    this.ratio = 1 / ratio;
    this.type = type;
    this.id = id;
};

Arena.Shape.prototype.getCenter = function () {
    return {x:this.posX, y:this.posY};
};

Arena.Shape.prototype.toString = function () {
    return this.id + ": " + this.type;
};

Arena.Shape.prototype.getID = function () {
    return this.id;
};

Arena.Shape.prototype.getType = function () {
    //circle = 1;
    //rectangle = 2;
    return this.type;
};

Arena.Circle = function (id, ratio, x, y, r) {
    Arena.Shape.call(this, id, 'circle', ratio, x, y);
    this.radius = r;
};
Arena.Circle.prototype = new Arena.Shape();

Arena.Circle.prototype.draw = function (c) {
    c.beginPath();
    c.strokeStyle = "black";
    c.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    c.closePath();
    c.stroke();
};

Arena.Circle.prototype.getBoundingBox = function () {
    return {x:this.posX * this.ratio, y:this.posY * this.ratio, r:this.radius * this.ratio};
};

Arena.Rectangle = function (id, ratio, x, y, halfWidth, halfHeight) {
    Arena.Shape.call(this, id, 'rectangle', ratio, x, y);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
};
Arena.Rectangle.prototype = new Arena.Shape();

Arena.Rectangle.prototype.draw = function (c) {
    c.beginPath();
    c.strokeStyle = "black";
    c.closePath();
    c.strokeRect(this.posX - this.halfWidth, this.posY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
};

Arena.Rectangle.prototype.getBoundingBox = function () {
    return {
        x1:(this.posX * this.ratio - this.halfWidth * this.ratio),
        y1:(this.posY * this.ratio - this.halfHeight * this.ratio),
        x2:(this.posX * this.ratio + this.halfWidth * this.ratio),
        y2:(this.posY * this.ratio + this.halfHeight * this.ratio)
    };
};



