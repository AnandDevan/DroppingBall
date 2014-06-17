function ThreeUtils()
{
}

ThreeUtils.addLight = function ( scene, x, y, z, color )
{
	var pointLight = new THREE.PointLight( color );
	pointLight.position.set( x, y, z );
	scene.add(pointLight);	
}

ThreeUtils.addCylinder = function ( scene, x, y, z, radius, height )
{
	var cylinderGeom = new THREE.CylinderGeometry( radius, radius, height, 10, 10, false );

	var rotX = new THREE.Matrix4();
	rotX.setRotationX( 0.5*Math.PI );

	var translation = new THREE.Matrix4();
	translation.setTranslation( x, y, z );

	var transf = new THREE.Matrix4();
	transf.multiplySelf(translation).multiplySelf(rotX);

	var cylinderMatrial = new THREE.MeshLambertMaterial({color:0x2100BB, transparent:true, opacity:0.3});
	var cylinder = new THREE.Mesh( cylinderGeom, cylinderMatrial );	
	cylinder.applyMatrix( transf );

	scene.add( cylinder );
	return cylinder;
}

ThreeUtils.createVertex = function (x,y,z)
{ 
	return new THREE.Vertex( new THREE.Vector3(x,y,z) );
}

ThreeUtils.addLine = function ( scene, x1, y1, z1, x2, y2, z2 )
{
	var linePts = new THREE.Geometry();
	var startVert = this.createVertex(x1, y1, z1), endVert = this.createVertex(x2, y2, z2);
	linePts.vertices.push( startVert, endVert  );
	var lineMat = new THREE.LineBasicMaterial( {color: 0xEE00EE, lineWidth: 2,  } );
	var resLine = new THREE.Line( linePts, lineMat );
	resLine.type = THREE.Lines;
	
 	scene.add( resLine );

	var lineData = { line:resLine, lineGeom:linePts, start:startVert, end:endVert }; 
	return lineData;
}

ThreeUtils.addRectangle = function ( scene, halfWidth, halfHeight, roomDepth )
{
	var rectanglePts = new THREE.Geometry();
	rectanglePts.vertices.push( this.createVertex(-halfWidth, -halfHeight, roomDepth),
								this.createVertex(-halfWidth, halfHeight, roomDepth),
								this.createVertex(-halfWidth, halfHeight, roomDepth),
								this.createVertex(halfWidth, halfHeight, roomDepth),
								this.createVertex(halfWidth, halfHeight, roomDepth),
								this.createVertex(halfWidth, -halfHeight, roomDepth),
								this.createVertex(halfWidth, -halfHeight, roomDepth),
								this.createVertex(-halfWidth, -halfHeight, roomDepth) );

	var lineMat = new THREE.LineBasicMaterial( {color: 0xEE3322, lineWidth: 200} );
	var rectangle = new THREE.Line( rectanglePts, lineMat, 0 );
	rectangle.type = THREE.Lines;
	
 	scene.add( rectangle );
	return rectangle;
}
