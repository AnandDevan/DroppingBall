var ballPathColor1 = 0X8B8989;
var ballPathColor2 = 0XCC22FF;
var ballPathColor3 = 0X6655DD;

function BallPath( color, scene )
{
    this.ballPathScene = scene;
    this.material = new THREE.MeshBasicMaterial( {color: color, transparent: false} );

	var particleMaterial = new THREE.ParticleBasicMaterial( {color: color, size: 8, transparent: false} ); 	
	this.numBallPathPoints = 2000;
	
	this.particles = new THREE.Geometry();
	for ( var p = 0; p < this.numBallPathPoints; p++ )
	{
		var particle = new THREE.Vertex( new THREE.Vector3(1e5, 1e5, 1e5 ) );
		this.particles.vertices.push(particle); 
	}

	this.particleSystem = new THREE.ParticleSystem( this.particles, particleMaterial );
    this.ballPathScene.add( this.particleSystem );

	this.curParticleIndex = 0;	
	
    var geometry = new THREE.CircleGeometry( 0.5*ball.radius, 20/*segments*/ );
    this.startPointMesh = new THREE.Mesh( geometry, this.material );
	this.startPointMesh.position.set( 1e5, 1e5, 1e5 );
    this.ballPathScene.add( this.startPointMesh );	
}


BallPath.prototype.reset = function()
{
	this.startPointMesh.position.set( 1e5, 1e5, 1e5 );

	for ( var p = 0; p < this.numBallPathPoints; p++ )
	{
		this.particleSystem.geometry.vertices[p].set( 1e5, 1e5, 1e5 );		
	}
	
	this.particleSystem.geometry.verticesNeedUpdate = true;
	this.curParticleIndex = 0;
}

BallPath.prototype.markStartPoint = function( ball )
{    
    var ballLoc = ball.getPosition();
    this.startPointMesh.position.set( ballLoc.x, ballLoc.y, ballLoc.z + 3.0 );
	this.particles.vertices[this.curParticleIndex].set( ballLoc.x, ballLoc.y, ballLoc.z );
}

BallPath.prototype.markPoint = function( ball )
{ 
	// add it to the geometry
	var ballLoc = ball.getPosition();

	if ( this.curParticleIndex < this.numBallPathPoints )
	{
		this.particleSystem.geometry.vertices[this.curParticleIndex++].set( ballLoc.x, ballLoc.y, ballLoc.z );
		this.particleSystem.geometry.verticesNeedUpdate = true;
		//particleSystem.geometry.__dirtyVertices = true;
	}  
}
