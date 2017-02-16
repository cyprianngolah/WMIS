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
        public int Key { get; set; }

        public string Name { get; set; }

        public TaxonomyTuple(int key, string name)
        {
            this.Key = key;
            this.Name = name;
        }
        // override object.Equals
        public bool Equals(TaxonomyTuple other)
        {
            if (other == null) return false;

            return this.Key == other.Key && this.Name.Equals(other.Name);
        }

        // override object.GetHashCode
        public override int GetHashCode()
        {
            return this.Name == null ? 0 : this.Name.GetHashCode();
        }
    }
}