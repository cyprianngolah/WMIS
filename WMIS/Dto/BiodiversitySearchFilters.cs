namespace Wmis.Dto
{
    using System;
    using System.Collections.Generic;

    using NPOI.SS.Formula.Functions;

    using Wmis.Models;

    public class BiodiversitySearchFilters 
    {
        public HashSet<TaxonomyTuple> Groups { get; set; }

        public HashSet<TaxonomyTuple> Orders { get; set; }

        public HashSet<TaxonomyTuple> Families { get; set; }

        public BiodiversitySearchFilters()
        {
            this.Groups = new HashSet<TaxonomyTuple>();
            this.Orders = new HashSet<TaxonomyTuple>();
            this.Families = new HashSet<TaxonomyTuple>();
        }
    }

    public class TaxonomyTuple : IEquatable<TaxonomyTuple>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        // override object.Equals
        public bool Equals(TaxonomyTuple other)
        {
            if (other == null) return false;

            return this.Id == other.Id && this.Name.Equals(other.Name);
        }

        // override object.GetHashCode
        public override int GetHashCode()
        {
            return this.Name == null ? 0 : this.Name.GetHashCode();
        }
    }
}