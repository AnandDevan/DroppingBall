function Terrain( launchAreaDeg, viewArea )
{
    this.angle = launchAreaDeg;
    this.viewArea = viewArea;
    this.segments = new Array();
    this.displaySegments = new Array();
    
    this.left = 0.0;
    this.right = 0.0;
    this.sceneBottomY = 0.0;
}

Terrain.prototype.addSegment = function( segement )
{
    this.segments.push( segement );
}

Terrain.prototype.applyContact = function( particle, fromPos, toPos, contactPos )
{
    // loop over terrain segments and look for contact
    for ( var i = 0; i < this.segments.length; i++ )
    {
        var contactType = this.segments[i].applyContact( particle, fromPos, toPos, contactPos );
        if ( contactType != TerrainContactType.kNoContact )
        {
            return contactType;
        }
    }
        
    return TerrainContactType.kNoContact;
}

Terrain.prototype.loadExample = function( width, height )
{
    var groundY = -0.25*height;
    var groundXEnd = 0.4*width;

    var radius = 0.1*height;
    
    this.left = -0.5*width;
    this.right = groundXEnd + radius;
    this.sceneBottomY = -0.5*height;

    var seg0 = new TerrainLine( new Point(-0.5*width, groundY, 0.0), new Point( groundXEnd, groundY, 0.0), Vector.yDir );

    var startAngle = Math.PI*( 1+ 0.25*Math.random() );
    var center = new Point( groundXEnd, groundY + radius, 0.0 );
    var seg3 = new TerrainArc( center, radius, startAngle, 2*Math.PI, Vector.yDir );

    var radius1 = 0.5*radius;
    var arcStart = seg3.geom.eval( startAngle );
    var dir = new Vector().initFromPoints( center, arcStart ).normalize();
    var center1 = center.addVector( dir.scale( radius + radius1 ) );    
    var seg2 = new TerrainArc( center1, radius1, startAngle - Math.PI, Math.PI, Vector.yDir, Vector.yDir );

    if ( center1.y < groundY )
    {
        var seg2EndAngle = Math.PI - Math.asin( Math.abs(groundY - center1.y) / radius1 );
        seg2.geom.endAngle = seg2EndAngle;
        
        seg1 = new TerrainLine( new Point(center1.x - radius1, groundY, 0.0), seg2.geom.eval(seg2EndAngle), Vector.yDir );        
    }
    else
    {
        seg1 = new TerrainLine( new Point(center1.x - radius1, center1.y, 0.0), new Point(center1.x - radius1, groundY, 0.0), Vector.xDir.opposite() );        
    }
    
    seg0.geom.end.x = seg1.geom.end.x;

    var seg4 = new TerrainLine( new Point(groundXEnd + radius, -0.25*height + radius, 0.0), new Point(groundXEnd + radius, 0.50*height, 0.0), Vector.xDir.opposite() );

    this.segments.push( seg0 );
    this.segments.push( seg1 );
    this.segments.push( seg2 );
    this.segments.push( seg3 );    
    this.segments.push( seg4 );
    
    this.displaySegments.push( seg0 );
    this.displaySegments.push( seg1 );
    this.displaySegments.push( seg2 );
    this.displaySegments.push( seg3 );
    this.displaySegments.push( seg4 );
    
    var seg5 = new TerrainLine( new Point(seg4.geom.end.x, seg4.geom.end.y, 0.0 ), new Point(0.5*width, 0.5*height, 0.0), Vector.yDir );
    var seg6 = new TerrainLine( new Point(0.5*width, 0.5*height, 0.0), new Point(0.5*width, -0.5*height, 0.0), Vector.xDir );
    var seg7 = new TerrainLine( new Point(0.5*width, -0.5*height, 0.0), new Point(-0.5*width, -0.5*height, 0.0), Vector.yDir );
    var seg8 = new TerrainLine( new Point(-0.5*width, -0.5*height, 0.0), new Point(seg0.geom.start.x, seg0.geom.start.y, 0.0), Vector.xDir );
    this.displaySegments.push( seg5 );
    this.displaySegments.push( seg6 );
    this.displaySegments.push( seg7 );
    this.displaySegments.push( seg8 );

    /* for debugging
    var refHor = new TerrainLine( new Point(-0.5*width, 0.0, 0.0), new Point(0.5*width, 0.0, 0.0) );
    var refVer = new TerrainLine( new Point(0.0, -0.5*height, 0.0), new Point(0.0, 0.5*height, 0.0) );
    this.segments.push( refHor );
    this.segments.push( refVer );
    this.displaySegments.push( refHor );
    this.displaySegments.push( refVer );
    */    
}

Terrain.prototype.loadCircleExample = function( radius, startAngle, endAngle )
{
    var arc = new TerrainArc( Point.origin, radius, startAngle, endAngle, Vector.yDir );
    this.segments.push( arc );
}
