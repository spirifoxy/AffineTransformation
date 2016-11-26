function mulMatVec(matrix, vector) {
    var result = [];
    for (var i = 0; i < vector.length; i++) {
        result[i] = 0;
        for (var j = 0; j < vector.length; j++) {
            result[i] += matrix[j][i] * vector[j];
        }
    }
    return result;
}

function rotateObject(object, angleX, angleY, angleZ) {

    var center = object.center;
    for (var k = 0; k < object.pointsNumber; k++) {
        for (var i = 0; i < object.points[k].length; i++)
            object.points[k][i] -= center[i]; 
        
        object.points[k][object.points[k].length] = 1; //h 

        if (angleX != 0)
            object.points[k] = rotateX(object.points[k], angleX);
        if (angleY != 0)
            object.points[k] = rotateY(object.points[k], angleY);
        if (angleZ != 0)
            object.points[k] = rotateZ(object.points[k], angleZ);

        object.points[k].length = 3; // убрать h из point

        for (var i = 0; i < object.points[k].length; i++)
            object.points[k][i] += center[i];
    }
}

function rotateX(point, angle) {
    var rotateMatrix = [
        [1,0,0,0],
        [0,Math.cos(angle),Math.sin(angle),0],  
        [0,-Math.sin(angle),Math.cos(angle),0],
        [0,0,0,1]
    ];

    return mulMatVec(rotateMatrix, point);
}

function rotateY(point, angle) {
    var rotateMatrix = [
        [Math.cos(angle),0,-Math.sin(angle),0],
        [0,1,0,1],
        [Math.sin(angle),0,Math.cos(angle),0],
        [0,0,0,1]
    ];

    return mulMatVec(rotateMatrix, point);
}

function rotateZ(point, angle) {
    var rotateMatrix = [
        [Math.cos(angle),Math.sin(angle),0,0],
        [-Math.sin(angle),Math.cos(angle),0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

    return mulMatVec(rotateMatrix, point);
}

function orthoProject(sceneInfo, point) {
    var orthoMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,0]
    ];

    var result = mulMatVec(orthoMatrix, point);
    result[0] = sceneInfo.width/2 + result[0];
    result[1] = sceneInfo.height/2 - result[1];

    return result;
}

function persProject(sceneInfo, point) {
    
    point[point.length] = 1; //h 

    var persMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,1/sceneInfo.distance],
        [0,0,0,1]
    ];

    var result = mulMatVec(persMatrix, point);
    
    result[0] /= result[3];
    result[1] /= result[3];
    result[2] /= result[3];
    
    result[0] = sceneInfo.width/2 + result[0];
    result[1] = sceneInfo.height/2 - result[1];

    point.length -= 1; 
    result.length -= 1;
    
    return result;
}


function translateObject(object, vector) {
    translate(vector, object.center);
    
    for (var i = 0; i < object.pointsNumber; i++) {
        translate(vector, object.points[i]);
    }
}

function translate(vector, point) {
    for (var i = 0; i < point.length; i++) {
        point[i] += vector[i];
    }
}

function reflect(object, vector) {
    var refMatrix = [
        [vector[0],0,0,0],
        [0,vector[1],0,0],
        [0,0,vector[2],0],
        [0,0,0,1]
    ];

    object.center = mulMatVec(refMatrix, object.center);
    
    for (var i = 0; i < object.pointsNumber; i++) {
        object.points[i] = mulMatVec(refMatrix, object.points[i]);  
    }
}

function scale(object, vector) {
    var scaleMatrix = [
        [vector[0],0,0,0],
        [0,vector[1],0,0],
        [0,0,vector[2],0],
        [0,0,0,1]
    ];

    object.center = mulMatVec(scaleMatrix, object.center);
    
    for (var i = 0; i < object.pointsNumber; i++) {
        object.points[i] = mulMatVec(scaleMatrix, object.points[i]);
    }
}