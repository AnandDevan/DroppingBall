var TerrainContactType = {
    "kNoContact"        : 0,
    "kLineTangContact"  : 1,
    "kLineAngleContact" : 2,
    "kArcTangContact"   : 3,
    "kArcAngleContact"  : 4
};

TerrainLine.prototype.applyContact = function( particle, startPos, endPos, contactPos )
{
    var vecParticlePath = new Vector().initFromPoints( startPos, endPos ).normalize();

    var endPosLocal = new Point( endPos.x, endPos.y, endPos.z );
    var distToTerrain = this.geom.distanceTo( endPos );
    if ( distToTerrain < particle.radius )
    {
        endPosLocal = endPosLocal.addVector( vecParticlePath.scale(10.0*particle.radius) );
    }

    var lineParticlePath = new Line( startPos, endPosLocal );
    var intersecPts = this.geom.intersectLine( lineParticlePath );
    if ( intersecPts.length > 0 )
    {
        var dotProd = Math.abs( vecParticlePath.dot( this.geom.getDirection() ) );
        var newPos = intersecPts[0].addVector( vecParticlePath.scale( -particle.radius*( 1.0/ Math.sqrt(1-dotProd*dotProd) ) ) );

        particle.setPosition( newPos );
        particle.velocity = this.geom.getDirection().reflectVector( particle.velocity );
        contactPos.set( newPos.x, newPos.y, newPos.z );
        return TerrainContactType.kLineAngleContact;    
    }
        
    return TerrainContactType.kNoContact;
}

TerrainArc.prototype.applyContact = function( particle, startPos, endPos, contactPos )
{
    if ( startPos.distanceTo( endPos ) < 1e-10 )
    {
        return TerrainContactType.kNoContact;
    }
   
    var particlePath = new Line( startPos, endPos );
    var closestPtStart = this.geom.closestPoint( startPos );
    var tangAtClosestPt = this.geom.getTangentAtPoint( closestPtStart );
    
    if ( tangAtClosestPt.isParallel( particle.velocity ) )
    {
        if ( closestPtStart.distanceTo(startPos) < particle.radius + 1e-6 )
        {            
            var ret = this.moveTangentially( particle, startPos, particle.velocity.length() );
            if ( ret )
            {
                var ballPos = particle.getPosition();
                contactPos.set( ballPos.x, ballPos.y, ballPos.z );
            }
            
            return ret;
        }
        else
        {
            var radialLineStart = new Line( this.geom.center, this.geom.startPoint );
            var radialLineEnd = new Line( this.geom.center, this.geom.endPoint );
            
            var intersecPts = radialLineStart.intersectLine( particlePath );
            if ( intersecPts.length == 0 ) {
                intersecPts = radialLineEnd.intersectLine( particlePath );
            }
            
            if ( intersecPts.length > 0 )
            {
                var velMag = particle.velocity.length(), distMag = startPos.distanceTo( intersecPts[0] );
                var distToMove = velMag; // Math.abs( particle.velocity.length() - startPos.distanceTo( intersecPts[0] ) );
                if ( distToMove < 1e-12 ) {
                    distToMove = particle.radius*1e-6;
                }
                   
                contactPos.set( intersecPts[0].x, intersecPts[0].y, intersecPts[0].z );
                return this.moveTangentially( particle, intersecPts[0]/*closestPtStart*/, distToMove );                
            }
        }
    }
    
    var centerToStartDist = this.geom.center.distanceTo( startPos );
    var centerToEndDist = this.geom.center.distanceTo( endPos ); 

    // if the particle path crosses arc then we have contact
    if ( (centerToStartDist < this.geom.radius && centerToEndDist > this.geom.radius ) || (centerToEndDist < this.geom.radius && centerToStartDist > this.geom.radius ) )
    {
        var intersecPts = this.geom.intersectLine( particlePath );
        if ( intersecPts.length == 1 )
        {
            var contactPt = intersecPts[0];
            if ( this.geom.isOn( contactPt ) == false )
            {
                return TerrainContactType.kNoContact;
            }
            if ( this.geom.isOn( contactPt ) == false )
            {
                return TerrainContactType.kNoContact;
            }

            particle.setPosition( contactPt );
            
            if ( particle.velocity.y < 0.0 )
            {
                particle.velocity.y = -Math.sqrt( Math.pow(particle.velocity.y, 2.0) + 2*particle.gravityConst*(contactPt.y - startPos.y) );
            }
            else
            {
                particle.velocity.y = Math.sqrt( Math.pow(particle.velocity.y, 2.0) + 2*particle.gravityConst*(contactPt.y - startPos.y) );                
            }
            
            // particle is crossing the arc, reflect velocity about the tangent
            var tangent = this.geom.getTangentAtPoint( contactPt );
            var velBefore = particle.velocity.length();
            particle.velocity = tangent.reflectVector( particle.velocity );
            var velAfter = particle.velocity.length();
            if ( Math.abs(velAfter-velBefore) > 1e-6 )
            {
                alert( "reflection fails" );
            }
            
            return TerrainContactType.kArcAngleContact;
        }
        else if ( intersecPts.length == 2 )
        {
            //var intersecPts = this.geom.intersectLine( new Line(startPos, endPos) );
            var contactPt = intersecPts[0];
            if ( this.geom.isOn( contactPt ) == false )
            {
                return false;
            }

            particle.setPosition( contactPt );
            
            particle.velocity.y -= ( Math.sqrt( Math.pow(particle.velocity.y, 2.0) - 2*particle.gravityConst*(startPos.y-contactPt.y) ) );

            // particle is crossing the arc, reflect velocity about the tangent
            var tangent = this.geom.getTangentAtPoint( contactPt );
            particle.velocity = tangent.reflectVector( particle.velocity );
            return TerrainContactType.kArcAngleContact;
        }
    }
    
    return TerrainContactType.kNoContact;
}

TerrainArc.prototype.moveTangentially = function( particle, startPos, distToMove )
{
    var radiusParticlePath = this.geom.center.distanceTo( startPos );
    var particlePathGeom = new Arc( this.geom.center, radiusParticlePath, this.geom.startAngle, this.geom.endAngle );
    
    var velocity = particle.getVelocity();
    var delAngle = Math.abs(distToMove) / particlePathGeom.radius;
    var startAngle = particlePathGeom.getAngle( startPos );
    
    // determine direction to go based on velocity
    var dotCross = new Vector().initFromPoints( particlePathGeom.center, startPos ).cross( velocity ).dot( Vector.zDir );
    if ( dotCross < 0.0 )
    {
        delAngle = -delAngle;
    }
    else if ( dotCross == 0.0 )
    {
        // if velocity is zero, depending on quadrant, delAngle will vary
        if ( startAngle < 0.5*Math.PI || startAngle > 1.5*Math.PI )
        {
            delAngle = -delAngle;
        }
    }

    var newPos = particlePathGeom.eval ( startAngle + delAngle );
    if ( particlePathGeom.isOn( newPos ) == false )
    {
        // the particle may have moved out of the arc, return in these cases
        return TerrainContactType.kNoContact;
    }
    
    var tangNewPos = particlePathGeom.getTangentAtPoint( newPos );
    var dotCross1 = new Vector().initFromPoints( particlePathGeom.center, newPos /*startPos*/ ).cross( tangNewPos ).dot( Vector.zDir );
    if ( dotCross*dotCross1 < 0.0 )
    {
        tangNewPos = tangNewPos.opposite();
    }
    
    var velStartMag = velocity.length();
    var delVelSqr = 2*particle.gravityConst*particlePathGeom.radius*( Math.sin(startAngle+delAngle) - Math.sin(startAngle) );
    var velEndMagSqr = Math.pow( velStartMag, 2.0 ) + delVelSqr;
    var velEndMag = 0.0;
    if ( velEndMagSqr > 0.0 )
    {
        velEndMag = Math.sqrt( velEndMagSqr );
    }
    
    if ( velEndMag < 1e-10 )
    {
        velEndMag = Math.abs(1e-3*particle.gravityConst);
        if ( tangNewPos.dot(Vector.yDir.opposite()) < 0.0 )
        {
            tangNewPos = tangNewPos.opposite();
        }
    }

    particle.setPosition( newPos );
    particle.setVelocity( tangNewPos.scale(velEndMag) );
    return TerrainContactType.kArcTangContact;
}
