//var ballMaterial = new THREE.MeshLambertMaterial( {color: 0xAA0033 });
//var ballMaterial = new THREE.MeshBasicMaterial( {color: 0xAA0033} );
//var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xAA0033 } );
var ballMaterial = new THREE.MeshPhongMaterial( { 
    color: 0xAAAA33,
    ambient: 0xAAAA33, // should generally match color
    specular: 0x050505,
    shininess: 100
} );

var ballContactMaterial = new THREE.MeshBasicMaterial( { 
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.5
} );

var ballHittingGroundSound = ("resources\\sound\\BallHittingGroundOutput.wav");
var BallHittingTargetSound = ("resources\\sound\\BallHittingTarget.wav");
var ballHitTargetSound = new Audio( BallHittingTargetSound );
var ballHitGroundSound = new Audio( ballHittingGroundSound );

function Ball( radius, position )
{
    this.radius = radius;
    this.initialPos = position;
    //this.geometry = new THREE.CircleGeometry( radius, 50 /*segments*/ );
    this.geometry = new THREE.SphereGeometry( radius, 20 /*segments*/ );
    this.mesh = new THREE.Mesh( this.geometry, ballMaterial );    
    this.mesh.position.set( position.x, position.y, position.z );
    this.gravityConst = -0.1;
    this.velocity = new Vector(0.0, 0.0, 0.0);
    
    this.lastContactPos = new Point( position.x, position.y, position.z );
    this.contactGeometry = new THREE.SphereGeometry( 0.25*radius, 20 /*segments*/ );
    this.contactPosMesh = new THREE.Mesh( this.contactGeometry, ballContactMaterial );    
    this.contactPosMesh.position.set( position.x, position.y, position.z );
    
    this.isReadyForLaunch = false;
    this.isActive = false;
}

Ball.prototype.initGraphics = function( scene )
{
    scene.add( this.mesh );
    scene.add( this.contactPosMesh );
}

Ball.prototype.getPosition = function()
{
    return new Point( this.mesh.position.x, this.mesh.position.y, this.mesh.position.z );
}

Ball.prototype.setPosition = function ( location )
{
    this.mesh.position.set( location.x, location.y, location.z );
}

Ball.prototype.getVelocity = function()
{
    return new Vector( this.velocity.x, this.velocity.y, this.velocity.z );
}

Ball.prototype.setVelocity = function( velocity )
{
    this.velocity = velocity;
}

Ball.prototype.move = function( time, terrain )
{
    var fromPos = this.getPosition();
    var toPos = fromPos.addVector( this.velocity.add(Vector.yDir.scale(0.5*this.gravityConst)) );
    if ( Math.abs(this.velocity.y) < 1e-6 )
    {
        //alert( "zero velocity" );
    }    

	var ballHitGround = false;
	
    var contactPos = new Point();
    var contactType = terrain.applyContact( this, fromPos, toPos, contactPos );
    if ( contactType == TerrainContactType.kNoContact )
    {
        this.setPosition( toPos );
        this.velocity.y += this.gravityConst;
    }
    else if ( contactType == TerrainContactType.kLineAngleContact )
    {        
        this.lastContactPos = contactPos;
        //toPos = fromPos.addVector( this.velocity );
        //this.setPosition( toPos );
        this.velocity.y *= 0.9;

		ballHitGround = true;
    }
	
	if ( target.isHit == true )
	{
		target.shrink( this );
	}
	else 
	{
		var ballHitTarget = target.isTargetHit( this );
		if ( ballHitTarget )
		{
			//var ballHitTargetSound = new Audio( BallHittingTargetSound );
			ballHitTargetSound.play();
		}
	}
	
	if ( ballHitGround )
	{
		var distance = target.position.distanceTo( ball.getPosition() );
		if ( distance > target.radius )
		{
			var ballHitGroundSound = new Audio( ballHittingGroundSound );
			ballHitGroundSound.cloneNode().play();

			this.contactPosMesh.scale.x = 1.0;
			this.contactPosMesh.scale.y = 1.0;
			this.contactPosMesh.scale.z = 1.0;
			this.contactPosMesh.position.set( contactPos.x, contactPos.y, contactPos.z ); 
		
			this.contactPosMesh.visible = true;			
		}
	}

    if ( this.contactPosMesh.scale.x < 8.0 )
    {
        var scaleFactor = 1.05, scaleFactor2 = 1.025;
        if ( this.contactPosMesh.scale.x < 4.0 )
        {
            this.contactPosMesh.scale.z *= scaleFactor;
            this.contactPosMesh.scale.x = this.contactPosMesh.scale.y = this.contactPosMesh.scale.z;
        }
        else
        {
            this.contactPosMesh.scale.z *= scaleFactor2;
            this.contactPosMesh.scale.x = this.contactPosMesh.scale.y = this.contactPosMesh.scale.z;
        }
    }
    else
    {
        this.contactPosMesh.visible = false;
    }
}
