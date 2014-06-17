var shuteMaterial = new THREE.MeshBasicMaterial( { color: 0x222266, transparent: true, opacity: 0.80} );

function BallShute( shuteBotLeft, shuteTopRight  )
{
    this.shuteBotLeft = shuteBotLeft;
    this.shuteTopRight = shuteTopRight;
}

BallShute.prototype.initGraphcis = function( scene )
{
    var shapeVertices = new Array();
    shapeVertices.push( new THREE.Vector2(this.shuteBotLeft.x, this.shuteBotLeft.y) ); 
    shapeVertices.push( new THREE.Vector2(this.shuteTopRight.x, this.shuteBotLeft.y) ); 
    shapeVertices.push( new THREE.Vector2(this.shuteTopRight.x, this.shuteTopRight.y) ); 
    shapeVertices.push( new THREE.Vector2(this.shuteBotLeft.x, this.shuteTopRight.y) ); 

    var shuteShape = new THREE.Shape( shapeVertices );
    var geometry = new THREE.ShapeGeometry( shuteShape );
    var mesh = new THREE.Mesh( geometry, shuteMaterial );
    scene.add( mesh );
}

BallShute.prototype.isInside = function ( point )
{
    if ( point.x < this.shuteBotLeft.x || point.x > this.shuteTopRight.x )
    {
        return false;
    }    
    
    if ( point.y < this.shuteBotLeft.y || point.y > this.shuteTopRight.y )
    {
        return false;
    }    
    
    return true;
}
