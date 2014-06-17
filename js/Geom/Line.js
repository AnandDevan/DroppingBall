function Line( start, end )
{
    this.start = start;
    this.end = end;
    return this;
}

Line.prototype.closestPoint = function( point )
{
    var lineDir = new Vector().initFromPoints( this.start, this.end ).normalize();
    var lineStartToPointVector = new Vector().initFromPoints( this.start, point );    
    var closestPoint = this.start.addVector( lineDir.scale(lineStartToPointVector.dot(lineDir) ) );
    return closestPoint;
}

Line.prototype.distanceTo = function( point )
{
    var lineDir = new Vector().initFromPoints( this.start, this.end ).normalize();
    var lineStartToPointVector = new Vector().initFromPoints( this.start, point );    
    var pointToClosestPointOnLineVec = lineStartToPointVector.opposite().add( lineDir.scale(lineStartToPointVector.dot(lineDir) ) );
    return pointToClosestPointOnLineVec.length();
}

Line.prototype.getDirection = function()
{
    return new Vector().initFromPoints( this.start, this.end ).normalize();
}

Line.prototype.getLength = function()
{
    return this.start.distanceTo( this.end );
}

Line.prototype.isOn = function( point )
{
    var startToPointVec = new Vector().initFromPoints( this.start, point );
    var lineDir = this.getDirection();
    if ( startToPointVec.dot( lineDir ) < -1e-8 )
    {
        return false;
    }
    
    if ( this.start.distanceTo(point) > this.getLength() + 1e-8 )
    {
        return false;
    }
    
    return true;
}

Line.prototype.intersectLine = function( otherLine )
{
    var intersecPoints = new Array();
 
    var thisLineDir = this.getDirection();
    var otherLineDir = otherLine.getDirection();
    
    var denom = (thisLineDir.x*otherLineDir.y - thisLineDir.y*otherLineDir.x);
    if ( Math.abs(denom) < 1e-8 )
    {
        return intersecPoints;
    }
      
    var p = ( (otherLine.start.x - this.start.x)*otherLineDir.y - (otherLine.start.y - this.start.y)*otherLineDir.x) / denom;
    var q = ( (otherLine.start.x - this.start.x)*thisLineDir.y - (otherLine.start.y - this.start.y)*thisLineDir.x) / denom;
    
    if ( Math.abs( this.start.z + p*thisLineDir.z - otherLine.start.z - q*otherLineDir.z ) > 1e-6 )
    {
        return intersecPoints;
    }
    
    var intersecPt = new Point( this.start.x + p*thisLineDir.x, this.start.y + p*thisLineDir.y, this.start.z + p*thisLineDir.z );
    
    if ( !this.isOn(intersecPt) || !otherLine.isOn(intersecPt) )
    {
        return intersecPoints;
    }
    
    intersecPoints.push( intersecPt );    
    return intersecPoints;
}

//Line.prototype.refelectPoint = function( point )
//{
//}
