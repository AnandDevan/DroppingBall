// startAngle, endAngle measured counter clockwise w.r.t to x axis
function Arc( center, radius, startAngle, endAngle, normalAtStart )
{
    this.center = center;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.surfaceNormal = normalAtStart;
    this.startPoint = this.eval( startAngle );;
    this.endPoint = this.eval( endAngle );
}


Arc.prototype.eval = function( angle )
{
    return this.center.addVector( new Vector(this.radius*Math.cos(angle), this.radius*Math.sin(angle), 0.0 ) );
}

Arc.prototype.getTangent = function ( angle )
{
    var radialPoint = this.eval( angle );
    var radialVec = new Vector().initFromPoints( center, radialPoint );
    var tangentVec = raidialVec.perpVector( Vector.zDir ).normalize();
    return tangentVec;
}

Arc.prototype.closestPoint = function( point )
{
    var radialVec = new Vector().initFromPoints( this.center, point ).normalize();
    var radiallyClosestPoint = this.center.addVector( radialVec.scale(this.radius) );
    if ( this.isOn(radiallyClosestPoint) )
    {
        return radiallyClosestPoint;
    }
    
    if ( this.startPoint.distanceTo( point ) < this.endPoint.distanceTo( point ) )
    {
        return new Point( this.startPoint.x, this.startPoint.y, this.startPoint.z );
    }
    else
    {
        return new Point( this.endPoint.x, this.endPoint.y, this.endPoint.z );
    }
}

Arc.prototype.getTangentAtPoint = function( point )
{
    if ( Math.abs(point.distanceTo(this.center) - this.radius) > 1e-6 )
    {
        return null;
    }
    
    var radialVec = new Vector().initFromPoints( this.center, point ).normalize();
    return radialVec.perpVector( Vector.zDir ).normalize();
}

Arc.prototype.intersectLine = function( line )
{
    var intersecPts = new Array();
    var closestPoint = line.closestPoint( this.center );
    var centerToClosestPtDist = closestPoint.distanceTo( this.center );

    if ( Math.abs(centerToClosestPtDist - this.radius) < 1e-6 )
    {
        intersecPts.push( this.center.addVector( new Vector().initFromPoints( this.center, closestPoint ) ) );
    }
    else if ( centerToClosestPtDist < this.radius )
    {
        var dist = Math.sqrt( Math.pow(this.radius, 2) - Math.pow(centerToClosestPtDist, 2) );
        var lineDir = line.getDirection();

        var pt0 = closestPoint.addVector( lineDir.scale(dist) );
        if ( line.isOn( pt0 ) )
        {
            intersecPts.push( pt0 );
        }
        
        var pt1 = closestPoint.addVector( lineDir.scale(-dist) );
        if ( line.isOn( pt1 ) )
        {
            intersecPts.push( pt1 );
        }
    }
    
    return intersecPts;
}

Arc.prototype.isOn = function( point )
{
    if ( Math.abs(point.distanceTo( this.center ) - this.radius) > 1e-6 )
    {
        return false;
    }
    
    if ( point.distanceTo( this.startPoint) < 1e-10 || point.distanceTo(this.endPoint) < 1e-10 )
    {
        return true;
    }

    var anglePoint = this.getAngle( point );
    if ( this.startAngle < this.endAngle )
    {
        if ( anglePoint > this.startAngle && anglePoint < this.endAngle )
        {
            return true;
        }
    }
    else
    {
        if ( anglePoint > this.startAngle || anglePoint < this.endAngle )
        {
            return true;
        }
    }
    
    return false;
}

Arc.prototype.getAngle = function( point )
{
    var vec = new Vector().initFromPoints( this.center, point ).normalize();
    var angle = Math.acos( Vector.xDir.dot( vec ) );
    if ( (vec.x >= 0.0 && vec.y < 0.0) || (vec.x <= 0.0 && vec.y < 0.0 ) )
    {
        angle = 2*Math.PI - angle;
    }
    
    return angle;    
}
