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

		rotateX(object.points[k], angleX);
		rotateY(object.points[k], angleY);
		rotateZ(object.points[k], angleZ);

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

	var result = mulMatVec(rotateMatrix, point);
	for (var i = 0; i < result.length; i++)
		point[i] = result[i];
}

function rotateY(point, angle) {
	var rotateMatrix = [
		[Math.cos(angle),0,-Math.sin(angle),0],
		[0,1,0,1],
		[Math.sin(angle),0,Math.cos(angle),0],
		[0,0,0,1]
	];


	var result = mulMatVec(rotateMatrix, point);
	for (var i = 0; i < result.length; i++)
		point[i] = result[i];
}

function rotateZ(point, angle) {
	var rotateMatrix = [
		[Math.cos(angle),Math.sin(angle),0,0],
		[-Math.sin(angle),Math.cos(angle),0,0],
		[0,0,1,0],
		[0,0,0,1]
	];

	var result = mulMatVec(rotateMatrix, point);
	for (var i = 0; i < result.length; i++)
		point[i] = result[i];
}

function orthoProject(sceneInfo, point)
{
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