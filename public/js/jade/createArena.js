$('#fileSelect').change(function (evt) {
    new Arena.CreateArena(evt.target);
});

var Arena = {elementName:"surface"};

Arena.CreateArena = function (imageList) {
    var that = this;

    var hasWhiteSpace = function hasWhiteSpace(s) {
        return /\s/g.test(s);
    };

    var errorHandling = {logDiv : $('#resultDiv')}
    errorHandling.clear = function(){
        this.logDiv.empty();
    };
    errorHandling.log = function(color,text){
        this.logDiv.append('<p style="color:'+color+';">'+text+'</p>');
    };

    $('#btnSave').click(function (evt) {
        errorHandling.clear();

        var arenaInfo = {boundingBoxes:that.shapeController.getAllBoundingBoxes()};
        arenaInfo.name = $('#labelArenaName')[0].value;
        if (hasWhiteSpace(arenaInfo.name)) {
            errorHandling.log('red','Name shouldn\'t contain any spaces');
        } else {
            var blah = $('#fileSelect').fileupload({

                                                       success:function (e, data, err) {
                                                           errorHandling.log('green','Arena created successfully');
                                                       },
                                                       fail:function (e, data) {
                                                           errorHandling.log('red','Failed to create the arena, See console for details');
                                                           console.debug("UPLOAD failed", e, data);
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
    } ;

    var reader = new FileReader();
    reader.onload = onReaderLoad(file);

    reader.readAsDataURL(file);

};

Arena.ShapeController = function (ratio) {
    var canvas = document.getElementById(Arena.elementName).children[0];
    var hammer = new Hammer(canvas,{drag_min_distance :1});

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
            buildingShape.posX2 = ev.position.x ;
            buildingShape.posY2 = ev.position.y ;

    };

    hammer.ondragend = function (p) {
        allShapes[buildingShape.getID()] = buildingShape;
        $('#boudingBoxesList').append('<li id="' + buildingShape.getID() + '">' + buildingShape + ' <a href="#" shape=' + buildingShape.getID() + '>Remove</a></li>');

        $('#boudingBoxesList li a').click(function () {
            var clickedShapeId = $(this).attr('shape');
            var clickedShape = allShapes[clickedShapeId];
            Arena.gs.delEntity(clickedShape);
            $('#' + clickedShapeId).remove();
            delete allShapes[clickedShapeId];
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

Arena.Shape = function (id, type, ratio, x, y, x2, y2) {
    this.posX = x;
    this.posY = y;
    this.posX2 = x2;
    this.posY2 = y2;
    this.ratio = 1 / ratio;
    this.type = type;
    this.id = id;
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

Arena.Circle = function (id, ratio, x, y, x2,y2) {
    Arena.Shape.call(this, id, 'circle', ratio, x, y, x2, y2);
};
Arena.Circle.prototype = new Arena.Shape();

Arena.Circle.prototype.draw = function (c) {
    c.beginPath();
    c.strokeStyle = "black";
    var radius = Math.sqrt(Math.pow(this.posX2 - this.posX, 2) + Math.pow(this.posY2 - this.posY, 2)) / 2;
    var x = (this.posX2 - this.posX)/2;
    var y = (this.posY2 - this.posY) / 2;
    c.arc(this.posX+x, this.posY+y, radius, 0, 2 * Math.PI);
    c.closePath();
    c.stroke();
};

Arena.Circle.prototype.getBoundingBox = function () {
    return {x:(this.posX+ (this.posX2 - this.posX)/2) * this.ratio, y:(this.posY + (this.posY2 - this.posY) / 2) * this.ratio, r: Math.sqrt(Math.pow(this.posX2 - this.posX, 2) + Math.pow(this.posY2 - this.posY, 2)) / 2 * this.ratio};
};

Arena.Rectangle = function (id, ratio, x, y, x2, y2) {
    Arena.Shape.call(this, id, 'rectangle', ratio, x, y, x2, y2);
};
Arena.Rectangle.prototype = new Arena.Shape();

Arena.Rectangle.prototype.draw = function (c) {
    c.beginPath();
    c.strokeStyle = "black";
    c.closePath();
    c.strokeRect(this.posX, this.posY , this.posX2 - this.posX , this.posY2 - this.posY );
};

Arena.Rectangle.prototype.getBoundingBox = function () {
    return {
        x1:(this.posX * this.ratio ),
        y1:(this.posY * this.ratio),
        x2:(this.posX2 * this.ratio ),
        y2:(this.posY2 * this.ratio)
    };
};



