function letterA() 
{
this.points=[
[0,0,0],

/*передняя часть А*/
[10,10,10],
[-10,10,10],
[-10,160,10],
[90,200,10],
[90,10,10],
[70,10,10], 
[70,70,10], 
[10,70,10],

/*вырезанный квадрат А1*/
[70,90,10],
[10,90,10],
[10,140,10],
[70,140,10],

/*задняя часть А*/
[10,10,35],
[-10,10,35],
[-10,160,35],
[90,200,35],
[90,10,35],
[70,10,35], 
[70,70,35], 
[10,70,35],

/*вырезанный квадрат А2*/
[70,90,35],
[10,90,35],
[10,140,35],
[70,140,35],
];


this.overlays=[
[1,2,3,4,5,6,7,8], //A1

[13,14,15,16,17,18,19,20], //A2

/*вырезанный квадрат*/
[9,21,22,10],
[10,22,23,11],
[11,23,24,12],
[12,24,21,9],

//бока внутр
[1,8,20,13],
[6,7,19,18],

//бока внеш
[2,3,15,14],
[4,5,17,16]

//низ и верх открыты
];

	this.center = [0, 0, 0];

	for (var i=0; i<this.points.length; i++)
	{
		this.center[0] += this.points[i][0];
		this.center[1] += this.points[i][1];
		this.center[2] += this.points[i][2];
	}

	this.pointsNumber = this.points.length;
	this.overlaysNumber = this.overlays.length;

	this.center[0] = this.center[0]/(this.pointsNumber-1);
	this.center[1] = this.center[1]/(this.pointsNumber-1);
	this.center[2] = this.center[2]/(this.pointsNumber-1);
}