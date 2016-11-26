
var ColorEnum = Object.freeze({WHITE: 0, RED: 1, GREEN: 2, BLUE: 3});

function scene() {
    this.param = {
        width: 1000,
        height: 500,
        distance: -500
    };
    this.color = 'rgb(255,255,255)';
    this.alpha = 0.5;
    this.object = {};
}

var world = new scene();

var tetaX = 0;
var tetaY = 0;
var tetaZ = 0;

var dx = 0;
var dy = 0;
var dz = 0;

var curColor = 0;

var isManualRotate = true;
var isPerspectiveOn = true;

function init() {
    world.object = new letterA();

    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
    document.onmousemove = onMouseMove;

    var rotationModeBtn = document.getElementById("rotation-mode-btn");
    var projectionBtn = document.getElementById("projection-btn");

    var reflectXBtn = document.getElementById("reflect-x");
    var reflectYBtn = document.getElementById("reflect-y");
    var reflectZBtn = document.getElementById("reflect-z");

    var scaleXM = document.getElementById("scale-x-");
    var scaleXP = document.getElementById("scale-x+");
    
    var scaleYM = document.getElementById("scale-y-");
    var scaleYP = document.getElementById("scale-y+");

    var scaleZM = document.getElementById("scale-z-");
    var scaleZP = document.getElementById("scale-z+");

    var translateX = document.getElementById("translate-x");
    var translateY = document.getElementById("translate-y");
    var translateZ = document.getElementById("translate-z");

    rotationModeBtn.onclick = changeRotationMode;
    projectionBtn.onclick = changeProjection;

    reflectXBtn.onclick = function() {
        reflect(world.object, [-1,1,1]);
    }
    reflectYBtn.onclick = function() {
        reflect(world.object, [1,-1,1]);
    }
    reflectZBtn.onclick = function() {
        reflect(world.object, [1,1,-1]);
    }

    scaleXM.onclick = function() {
        scale(world.object, [0.9,1,1]);
    }
    scaleXP.onclick = function() {
        scale(world.object, [1.1,1,1]);
    }
    scaleYM.onclick = function() {
        scale(world.object, [1,0.9,1]);
    }
    scaleYP.onclick = function() {
        scale(world.object, [1,1.1,1]);
    }
    scaleZM.onclick = function() {
        scale(world.object, [1,1,0.9]);
    }
    scaleZP.onclick = function() {
        scale(world.object, [1,1,1.1]);
    }

    translateX.onmousemove = function() {
        dx = +this.value;
    }
    translateY.onmousemove = function() {
        dy = +this.value;
    }
    translateZ.onmousemove = function() {
        dz = +this.value;
    }
    translateX.onmouseup =
        translateY.onmouseup =
        translateZ.onmouseup =
        function() {
            dx = dy = dz = 0;
            this.value = 0;
    }

    setInterval(draw, 10);
}

function onKeyDown(evt) {
    if(evt.keyCode==32) {
        curColor = (curColor+1) % 4;
        switch(curColor) {
            case ColorEnum.WHITE:
                world.color = 'rgb(255,255,255)';
                break;
            case ColorEnum.RED:
                world.color = 'rgb(255,0,0)';
                break;
            case ColorEnum.GREEN:
                world.color = 'rgb(0,255,0)';
                break;
            case ColorEnum.BLUE:
                world.color = 'rgb(0,0,255)';
                break;
        }
    }

    //блок поворота
    if (isManualRotate) {
        if(evt.keyCode==87) { //w
            tetaX = -0.1;
        }
        if(evt.keyCode==83) { //s
            tetaX = 0.1;
        }
        if(evt.keyCode==68) { //d
            tetaY = 0.1;
        }
        if(evt.keyCode==65) { //a
            tetaY = -0.1;
        }
        if(evt.keyCode==81) { //q
            tetaZ = 0.1;
        }
        if(evt.keyCode==69) { //e
            tetaZ = -0.1;
        }
    }
}

function onKeyUp(evt) {
    if (isManualRotate) {
        //wasd
        if([87,83].indexOf(evt.keyCode) > -1) {
            tetaX = 0;
        }
        if([68,65].indexOf(evt.keyCode) > -1) {
            tetaY = 0;
        }
        if([81,69].indexOf(evt.keyCode) > -1) {
            tetaZ = 0;
        }
    }
}

function onMouseMove(evt) {
    if (isManualRotate)
        return;
    var x = evt.pageX - document.getElementById("display").offsetLeft;
    var y = evt.pageY - document.getElementById("display").offsetTop;

    if ((x > 0) && (x < world.param.width) 
        && (y > 0) && (y < world.param.height)) {
        tetaY = 0.1 * (x - world.param.width/2) / world.param.width/2;
        tetaX = 0.1 * (y - world.param.height/2) / world.param.height/2;
    }
}

function changeRotationMode(evt) {
    var rotTitle = document.getElementById("rotation-title");
    var text = "Режим вращения: ";
    
    isManualRotate = !isManualRotate;
    tetaX = tetaY = tetaZ = 0;

    text += isManualRotate ? "ручной" : "автоматический";
    rotTitle.innerHTML = text;
}

function changeProjection(evt) {
    var projTitle = document.getElementById("projection-title");
    var text = "Проекция: ";

    isPerspectiveOn = !isPerspectiveOn;

    text += isPerspectiveOn ? "перспективная" : "ортографическая";
    projTitle.innerHTML = text;
}


function draw() {
    var canvas = document.getElementById("display");
    
    if (!canvas.getContext) 
        retrun;

    var ctx = canvas.getContext("2d");
    var projectedPoints = [];
    
    ctx.clearRect(0, 0, world.param.width, world.param.height);
    ctx.globalAlpha = world.alpha;
    ctx.fillStyle = world.color;

    rotateObject(world.object, tetaX, tetaY, tetaZ);
    translateObject(world.object, [dx, dy, dz]);

    for (var i = 0; i < world.object.points.length; i++)
        projectedPoints[i] = isPerspectiveOn 
            ? persProject(world.param, world.object.points[i])
            : orthoProject(world.param, world.object.points[i]);

    for (var i = 0; i < world.object.overlaysNumber; i++) {
        var vertexIndex = world.object.overlays[i];

        ctx.beginPath();
        ctx.moveTo(projectedPoints[vertexIndex[0]][0], projectedPoints[vertexIndex[0]][1]);

        for (var z = 1; z < world.object.overlays[i].length; z++)
            ctx.lineTo(projectedPoints[vertexIndex[z]][0], projectedPoints[vertexIndex[z]][1]);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}