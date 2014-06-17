module( "ContactProcessing" );
test( "TerrainArc:moveTangentially", function()
  {    
      // hemispherical bowl like terrain (u shaped...)
      var terrainArcRadius = 10.0;
      var terrainArc = new TerrainArc( Point.origin, terrainArcRadius, Math.PI, 2*Math.PI );
      var particle = new Ball( 1.0, new Point(terrainArcRadius, 10.0, 0.0) );
      
      var leftEnd = new Point(-terrainArcRadius, 0.0, 0.0);
      var rightEnd = new Point(terrainArcRadius, 0.0, 0.0);
      var bottom = new Point(0.0, -terrainArcRadius, 0.0);
      
      var quarterArcLength = 0.25*Math.PI*terrainArcRadius;
      var terrainRadiusRootTwo = Math.sqrt(2.0)*terrainArcRadius;
      
      // drop with zero velocity from outside arc
      {
          particle.setVelocity( new Vector(0.0, 0.0, 0.0) );
          var ret = terrainArc.moveTangentially( particle, new Point(terrainArcRadius, 5.0, 0.0), 2.0/*distToMove*/ );
          ok ( ret == false );
      }
      
      // drop with zero velocity at right end of arc
      {
          particle.setVelocity( new Vector(0.0, 0.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, rightEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball position" );
          ok ( Math.abs( particle.getVelocity().length() - Math.sqrt(2*particle.gravityConst*-0.5*terrainRadiusRootTwo) ) < 1e-8, "Testing ball velocity" );
      }

      // drop with zero velocity at left end of arc
      {
          particle.setVelocity( new Vector(0.0, 0.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, leftEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(-0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          ok ( Math.abs( particle.getVelocity().length() - Math.sqrt(2*particle.gravityConst*-0.5*terrainRadiusRootTwo) ) < 1e-8, "Testing ball velocity" );
      }
      
      // drop with zero velocity at left end, -ve distance to move
      {
          particle.setVelocity( new Vector(0.0, 0.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, leftEnd, -quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(-0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          ok ( Math.abs( particle.getVelocity().length() - Math.sqrt(2*particle.gravityConst*-0.5*terrainRadiusRootTwo) ) < 1e-8, "Testing ball velocity" );
      }
      
      // ball with vertical velocity of -2 at right end
      {
          particle.setVelocity( new Vector(0.0, -2.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, rightEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*-0.5*terrainRadiusRootTwo );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }

      // ball moving up at right end
      {
          particle.setVelocity( new Vector(0.0, 2.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, rightEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == false );
      }
      
      // ball at left end moving down
      {
          particle.setVelocity( new Vector(0.0, -2.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, leftEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(-0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*-0.5*terrainRadiusRootTwo );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }

      // ball at left end moving up
      {
          particle.setVelocity( new Vector(0.0, 2.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, leftEnd, quarterArcLength/*distToMove*/ );
          ok ( ret == false );
      }
      
      // ball at bottom of arc moving left
      {
          particle.setVelocity( new Vector(-2.0, 0.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, bottom, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(-0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*(terrainArcRadius - 0.5*terrainRadiusRootTwo) );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }
      
      // ball at bottom of arc moving right
      {
          particle.setVelocity( new Vector(2.0, 0.0, 0.0) );
          ret = terrainArc.moveTangentially( particle, bottom, quarterArcLength/*distToMove*/ );
          ok ( ret == true );
          ok ( particle.getPosition().distanceTo( new Point(0.5*terrainRadiusRootTwo, -0.5*terrainRadiusRootTwo, 0.0) ) < 1e-8, "Testing ball velocity" );
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*(terrainArcRadius - 0.5*terrainRadiusRootTwo) );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }
      
      // ball at bottom of arc moving right, take into account radius of particle
      {
          var radiusParticlePath = terrainArc.geom.radius - particle.radius;
          particle.setVelocity( new Vector(2.0, 0.0, 0.0) );
          var particlePosAtBottomOfArc = bottom.addVector( Vector.yDir.scale(particle.radius) );
          
          ret = terrainArc.moveTangentially( particle, particlePosAtBottomOfArc, 0.25*Math.PI*radiusParticlePath/*distToMove*/ );            
          ok ( ret == true );
          
          var xCoordExpecPos = 0.5*Math.sqrt(2.0)*radiusParticlePath;
          var yCoordExpecPos = -0.5*Math.sqrt(2.0)*radiusParticlePath;
          ok ( particle.getPosition().distanceTo( new Point(xCoordExpecPos, yCoordExpecPos, 0.0) ) < 1e-8, "Testing ball position" );
          
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*(radiusParticlePath - 0.5*Math.sqrt(2.0)*radiusParticlePath) );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }

      // ball at bottom of arc moving left, accounting radius of particle in initial position
      {
          var radiusParticlePath = terrainArc.geom.radius - particle.radius;
          particle.setVelocity( new Vector(-2.0, 0.0, 0.0) );
          var particlePosAtBottomOfArc = bottom.addVector( Vector.yDir.scale(particle.radius) );
          
          ret = terrainArc.moveTangentially( particle, particlePosAtBottomOfArc, 0.25*Math.PI*radiusParticlePath/*distToMove*/ );            
          ok ( ret == true );
          
          var xCoordExpecPos = -0.5*Math.sqrt(2.0)*radiusParticlePath;
          var yCoordExpecPos = -0.5*Math.sqrt(2.0)*radiusParticlePath;
          ok ( particle.getPosition().distanceTo( new Point(xCoordExpecPos, yCoordExpecPos, 0.0) ) < 1e-8, "Testing ball position" );
          
          var expecVel = Math.sqrt( 2*2 + 2*particle.gravityConst*(radiusParticlePath - 0.5*Math.sqrt(2.0)*radiusParticlePath) );
          ok( Math.abs( particle.getVelocity().length() - expecVel ) < 1e-8, "Testing ball velocity" );
      }
              
      return true;
  }
);

test( "TerrainLine:applyContact", function()
    {
        var terrainLine = new TerrainLine( new Point(-100.0, 0.0, 0.0), new Point(100.0, 0.0, 0.0) );
        var particle = new Ball( 1.0, Point.origin );
 
        // ball travelling from (5,5,0) at 45 deg to origin, crossing line
        {
            particle.setPosition( new Point(5.0, 5.0, 0.0) );
            particle.setVelocity( new Vector(-10.0, -10.0, 0.0) );
            var startPos = new Point(5.0, 5.0, 0.0), endPos = new Point( -5.0, -5.0, 0.0 );            

            var ret = terrainLine.applyContact( particle, startPos, endPos );
            
            var expecPos = new Point( 1.0, 1.0, 0.0 );
            ok( particle.getPosition().distanceTo( expecPos ) < 1e-8, "Testing ball position" );
            
            var expecVel = new Vector( -10.0, 10.0, 0.0 );
            ok ( particle.getVelocity().isParallel(expecVel), "Testing ball velocity direction" );
            ok ( Math.abs(particle.getVelocity().length() - expecVel.length()) < 1e-8, "Testing ball velocity magnitude" );
        }
  
        // ball travelling from (5,5,0) at 45 deg to origin
        {
            particle.setPosition( new Point(5.0, 5.0, 0.0) );
            particle.setVelocity( new Vector(-4.5, -4.5, 0.0) );
            var startPos = new Point(5.0, 5.0, .0), endPos = new Point( 0.5, 0.5, 0.0 );            

            var ret = terrainLine.applyContact( particle, startPos, endPos );
            
            var expecPos = new Point( 1.0, 1.0, 0.0 );
            ok( particle.getPosition().distanceTo( expecPos ) < 1e-8, "Testing ball position" );
            
            var expecVel = new Vector( -4.5, 4.5, 0.0 );
            ok ( particle.getVelocity().isParallel(expecVel), "Testing ball velocity direction" );
            ok ( Math.abs(particle.getVelocity().length() - expecVel.length()) < 1e-8, "Testing ball velocity magnitude" );
        }
  }
);
