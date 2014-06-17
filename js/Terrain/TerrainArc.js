function TerrainArc( center, radius, startAngle, endAngle )
{
    this.geom = new Arc( center, radius, startAngle, endAngle );
    this.normal = new Vector();
}
