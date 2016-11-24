
var ColorEnum = Object.freeze({WHITE: 0, RED: 1, GREEN: 2, BLUE: 3});

	function scene()
	{
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

	var curColor = 0;

	var manualRotate = true;

	function init()
	{
	    world.object = new letterA();
	    
	    document.onkeydown = onKeyDown;
	    document.onkeyup = onKeyUp;
	    setInterval(draw, 10);
	}

	function onKeyDown(evt) 
	{
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
	    if (manualRotate) {
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

	function onKeyUp(evt) 
	{
	    if (manualRotate) {
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

	
	function draw() 
	{
	    var canvas = document.getElementById("display");
	    var projTitle = document.getElementById("projection-title");

	    if (!canvas.getContext) 
	        retrun;

	    var ctx = canvas.getContext("2d");
	    var projectedPoints = [];
	    
	    ctx.clearRect(0, 0, world.param.width, world.param.height);
	    ctx.globalAlpha = world.alpha;
	    ctx.fillStyle = world.color;

	    rotateObject(world.object, tetaX, tetaY, tetaZ);

	    for (var i = 0; i < world.object.points.length; i++)
            projectedPoints[i] = orthoProject(world.param, world.object.points[i]);
        projTitle.innerHTML = "Проекция: ортографическая";
	    
	    for (var i = 0; i < world.object.overlaysNumber; i++)
	    {
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