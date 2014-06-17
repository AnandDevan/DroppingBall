function Vector( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}

Vector.prototype.initFromPoints = function( p1, p2 )
{
    this.x = p2.x - p1.x;
    this.y = p2.y - p1.y;
    this.z = p2.z - p1.z;
    return this;
}

Vector.prototype.opposite = function()
{
    var vector = new Vector( -this.x, -this.y, -this.z );
    return vector;
}

Vector.prototype.normalize = function()
{
    var length = this.length();
    if ( length > 0.0 )
    {
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }
    
    return this;
}

Vector.prototype.add = function( otherVector )
{
    var vector = new Vector( this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z );
    return vector;
}

Vector.prototype.subtract = function( otherVector )
{
    var vector = new Vector( this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z );
    return vector;
}

Vector.prototype.scale = function( scaleValue )
{
    var vector = new Vector( scaleValue*this.x, scaleValue*this.y, scaleValue*this.z );
    return vector;
}

Vector.prototype.length = function()
{
    return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );
}

Vector.prototype.dot = function( otherVector )
{
    var dotProduct = this.x*otherVector.x + this.y*otherVector.y + this.z*otherVector.z;
    return dotProduct;
}

Vector.prototype.cross = function( otherVector )
{
    return new Vector( (this.y*otherVector.z - this.z*otherVector.y),
                        (this.z*otherVector.x - this.x*otherVector.z),
                        (this.x*otherVector.y - this.y*otherVector.x) );
}

Vector.prototype.perpVector = function ( normal )
{
    var perpVec = normal.cross( this );
    return normal.cross( this );
}

Vector.prototype.reflectVector = function( vector )
{
    return this.scale( 2*this.dot(vector) ).subtract( vector );
}

Vector.prototype.isParallel = function( otherVector )
{
    if ( Math.abs( Math.abs(this.dot(otherVector)) - this.length()*otherVector.length() ) < 1e-6 )
    {
        if ( this.length() < 1e-12 || otherVector.length() < 1e-12  )
        {
            return false;
        }
        
        return true;
    }
    return false;
}

Vector.xDir = new Vector( 1.0, 0.0, 0.0 );
Vector.yDir = new Vector( 0.0, 1.0, 0.0 );
Vector.zDir = new Vector( 0.0, 0.0, 1.0 );
