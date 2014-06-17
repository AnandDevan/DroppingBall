function TerrainLine( start, end, normalAtStart )
{
    this.geom = new Line( start, end );
    this.surfaceNormal = normalAtStart;
}
