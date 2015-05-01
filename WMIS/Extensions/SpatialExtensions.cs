using DotSpatial.Topology;
using System;

namespace Wmis.Extensions
{
    /// <summary>
    /// Extention class to add functionality to the existing DotSpatial library
    /// </summary>
    public static class SpatialExtensions
    {
        /// <summary>
        /// Determines the distance between to coordinations (lat/long) using the Great Circle Distance (Haversine) method
        /// </summary>
        /// <param name="coord1">First coordinate</param>
        /// <param name="coord2">Second coordinate</param>
        /// <returns>Distance in Kilometers</returns>
        public static double KilometersTo(this Coordinate coord1, Coordinate coord2)
        {
            var rad = Math.PI / 180;
            var a1 = coord1.Y * rad;
            var a2 = coord1.X * rad;
            var b1 = coord2.Y * rad;
            var b2 = coord1.X * rad;
            var dlon = b2 - a2;
            var dlat = b1 - a1;
            var a = Math.Pow(Math.Sin(dlat / 2), 2) + Math.Cos(a1) * Math.Cos(b1) * Math.Pow((Math.Sin(dlon / 2)), 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var R = 6371;
            return R * c;
        }
    }
}