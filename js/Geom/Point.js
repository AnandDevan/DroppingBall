function Point( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
}

Point.prototype.addVector = function ( vec )
{
    var point = new Point( this.x + vec.x, this.y + vec.y, this.z + vec.z );
    return point;
}

Point.prototype.distanceTo = function ( otherPoint )
{
    return Math.sqrt( Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2) + Math.pow(this.z - otherPoint.z, 2) );
}

Point.prototype.set = function ( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
} 

Point.origin = new Point( 0.0, 0.0, 0.0 );