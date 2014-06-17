var borderMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff, opacity: 1, linewidth: 15 } );

// for texture
var assignUVs = function( geometry ){
    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;
}

// create terrain mesh based on geometry and assign texture materials
var createMesh = function( geometry )
{
	assignUVs( geometry );
	
	var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;
    var width = max.x - min.x;
    var height = max.y - min.y;
    
    if ( width < 1e-8 || height < 1e-8 ) return;

	var imgTexture = THREE.ImageUtils.loadTexture( "resources/image/sand.png" );
//	var imgTexture = THREE.ImageUtils.loadTexture( "resources/image/grass1.png" );
	imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping; 
	var imageSize = 64;
	
	var numX = width / imageSize;
	var numY = height / imageSize;

	imgTexture.repeat.set( numX, numY );//8, 2 );

	var terrainMaterial = new THREE.MeshBasicMaterial( { map: imgTexture, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, terrainMaterial );    
    return mesh;	
}


Line.prototype.initGraphics = function( scene, terrainBotY )
{
    // for boundary line
    var geometry  = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( this.start.x, this.start.y, this.start.z ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( this.end.x, this.end.y, this.end.z ) ) );
    this.graphics = new THREE.Line( geometry, borderMaterial );
    scene.add( this.graphics );
    
    // for shaded area below ground
    var shapeVertices = new Array();
    shapeVertices.push( new THREE.Vector2(this.start.x, this.start.y) ); 
    shapeVertices.push( new THREE.Vector2(this.end.x, this.end.y) ); 
    shapeVertices.push( new THREE.Vector2(this.end.x, terrainBotY) ); 
    shapeVertices.push( new THREE.Vector2(this.start.x, terrainBotY) ); 
    shapeVertices.push( new THREE.Vector2(this.start.x, this.start.y) ); 

    var terrainShape = new THREE.Shape( shapeVertices );
    var geometry = new THREE.ShapeGeometry( terrainShape );    
    var mesh = createMesh( geometry );
    if ( mesh == null )
    {
    	return;
    }
  
    mesh.position.z = -100;
	scene.add( mesh );
}

Arc.prototype.initGraphics = function( scene, terrainBotY )
{
    var numSeg = 100;
    var curAngle = this.startAngle;
    var delAngle = (this.endAngle - this.startAngle) / numSeg;
    if ( this.startAngle > this.endAngle )
    {
        delAngle += 2*Math.PI / numSeg;
    }
    
    var geometry  = new THREE.Geometry();
    var shapeVertices = new Array();
    
    for ( var seg = 0; seg < numSeg + 1; seg++, curAngle+= delAngle)
    {
        geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( ( this.center.x + this.radius*Math.cos(curAngle) ), (this.center.y + this.radius*Math.sin(curAngle) ), this.center.z )  ) );
        shapeVertices.push( new THREE.Vector2( this.center.x + this.radius*Math.cos(curAngle), this.center.y + this.radius*Math.sin(curAngle) ) );
    }
    
    // for boundary    
    this.graphics = new THREE.Line( geometry, borderMaterial );
    scene.add( this.graphics );

    // for shaded area below ground
    var firstVertex = shapeVertices[0];
    var lastVertex = shapeVertices[shapeVertices.length - 1];
    shapeVertices.push( new THREE.Vector2(lastVertex.x, terrainBotY) ); 
    shapeVertices.push( new THREE.Vector2(firstVertex.x, terrainBotY) ); 
    shapeVertices.push( new THREE.Vector2(firstVertex.x, firstVertex.y) ); 

    var terrainShape = new THREE.Shape( shapeVertices );
    var geometry = new THREE.ShapeGeometry( terrainShape );
    var mesh = createMesh( geometry );

    scene.add( mesh );
}

Terrain.prototype.initGraphics = function( scene ) 
{
    var terrainBotY = this.sceneBottomY;
    this.displaySegments.forEach( function(segment) {
            segment.geom.initGraphics( scene, terrainBotY );
        }
    );
}
