var targetMaterial = new THREE.MeshPhongMaterial( { 
    color: 0xAA1111,
	ambient: 0xAA1111, // should generally match color
	shininess: 100,
	transparent: false,
	opacity: 0.75
} );

function Target( radius, position )
{
    this.radius = radius;
    this.position = position;
	this.isHit = false;

    this.geometry = new THREE.SphereGeometry( radius, 1000 /*segments*/ );
    this.mesh = new THREE.Mesh( this.geometry, targetMaterial );    
    this.mesh.position.set( position.x, position.y, position.z );
	
	var arcShape = new THREE.Shape();
	//arcShape.moveTo( 0, 0 );
    arcShape.absarc( 0, 0, radius, 0.0, Math.PI, true );
	arcShape.moveTo( radius, 0 );
	var extrudeSettings = { amount: 20 };
	this.geometry1 = new THREE.ExtrudeGeometry( arcShape, extrudeSettings );
	this.mesh1 = new THREE.Mesh( this.geometry1, targetMaterial);
	this.mesh1.position.set( position.x, position.y, position.z );
 }

Target.prototype.initGraphics = function( scene )
{
	scene.add( this.mesh1 );
}

Target.prototype.isTargetHit = function( ball )
{
	var distance = ball.getPosition().distanceTo( this.position );
	if ( distance < this.radius + ball.radius )
	{
		this.isHit = true;
		return true;
	}
	
	return false;
}

Target.prototype.shrink = function( ball )
{
	var scaleFactor = 0.99;
	this.mesh1.scale.z *= scaleFactor;
	this.mesh1.scale.x = this.mesh1.scale.y = this.mesh1.scale.z;
	
	if ( this.mesh1.scale.x < 0.1 )
	{
		this.mesh1.scale.x = this.mesh1.scale.y = this.mesh1.scale.z = 1.0;
		this.isHit = false;
	}
}

Target.prototype.reset = function()
{
	this.mesh1.scale.x = this.mesh1.scale.y = this.mesh1.scale.z = 1.0;
	this.isHit = false;
}