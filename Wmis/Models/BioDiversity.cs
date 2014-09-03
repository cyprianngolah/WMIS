namespace Wmis.Models
{
	/// <summary>
	/// Model object for BioDiversity
	/// </summary>
	public class BioDiversity : Base.AuditedKeyedModel
	{
		/// <summary>
		/// Gets or sets the Name value
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets the Common Name
		/// </summary>
		public string CommonName { get; set; }

		/// <summary>
		/// Gets or sets the Sub Species Name
		/// </summary>
		public string SubSpeciesName { get; set; }

		public string EcoType { get; set; }

		public string Population { get; set; }

		public string NsGlobalId { get; set; }

		public string NsNwtId { get; set; }

		public string Elcode { get; set; }

		public Taxonomy Kingdom { get; set; }

		public Taxonomy Phylum { get; set; }

		public Taxonomy SubPhylum { get; set; }

		public Taxonomy Class { get; set; }

		public Taxonomy SubClass { get; set; }

		public Taxonomy Order { get; set; }

		public Taxonomy SubOrder { get; set; }

		public Taxonomy InfraOrder { get; set; }

		public Taxonomy SuperFamily { get; set; }

		public Taxonomy Family { get; set; }

		public Taxonomy SubFamily { get; set; }

		public Taxonomy Group { get; set; }

		public bool? NonNtSpecies { get; set; }

		public int? CanadaKnownSubSpeciesCount { get; set; }

		public string CanadaKnownSubSpeciesDescription { get; set; }

		public int? NwtKnownSubSpeciesCount { get; set; }

		public string NwtKnownSubSpeciesDescription { get; set; }

		public int? AgeOfMaturity { get; set; }

		public string AgeOfMaturityDescription { get; set; }

		public int? ReproductionFrequencyPerYear { get; set; }

		public string ReproductionFrequencyPerYearDescription { get; set; }

		public int? Longevity { get; set; }

		public string LongevityDescription { get; set; }

		public string VegetationReproductionDescription { get;set; }

		public string HostFishDescription { get; set; }
		
		public string OtherReproductionDescription { get; set; }

		public string EcozoneDescription  { get; set; }

		public string EcoregionDescription { get; set; }

		public string ProtectedAreaDescription { get; set; }

		public string RangeExtentScore { get; set; }

		public string RangeExtentDescription  { get; set; }

		public string DistributionPercentage { get; set; }

		public string AreaOfOccupancyScore { get; set; }

		public string AreaOfOccupancyDescription { get; set; }

		public string HistoricalDistributionDescription { get; set; }

		public string MarineDistributionDescription { get; set; }

		public string WinterDistributionDescription { get; set; }

		public string HabitatDescription { get; set; }

		public string EnvironmentalSpecificityScore { get; set; }

		public string EnvironmentalSpecificityDescription  { get; set; }

		public string PopulationSizeScore { get; set; }

		public string PopulationSizeDescription { get; set; }

		public string NumberOfOccurencesScore { get; set; }

		public string NumberOfOccurencesDescription { get; set; }

		public string DensityDescription { get; set; }

		public string ThreatsScore { get; set; }

		public string ThreatsDescription { get; set; }

		public string IntrinsicVulnerabilityScore { get; set; }

		public string IntrinsicVulnerabilityDescription { get; set; }

		public string ShortTermTrendsScore { get; set; }

		public string ShortTermTrendsDescription { get; set; }

		public string LongTermTrendsScore { get; set; }

		public string LongTermTrendsDescription { get; set; }

		public StatusRank StatusRank { get; set; }

		public string StatusRankDescription { get; set; }

		public string SRank { get; set; }

		public string DecisionProcessDescription { get; set; }

		public string EconomicStatusDescription { get; set; }

		public CosewicStatus CosewicStatus { get; set; }

		public string CosewicStatusDescription { get; set; }

		public string NRank { get; set; }

		public string SaraStatus { get; set; }

		public string FederalSpeciesAtRiskStatusDescription { get; set; }

		public string NwtsarcAssessmentDescription { get; set; }

		public string NwtStatusRank { get; set; }

		public string NwtSpeciesAtRiskStatusDescription { get; set; }

		public string CanadianConservationSignificanceDescription { get; set; }

		public string IucnStatus { get; set; }

		public string GRank { get; set; }

		public string IucnDescription { get; set; }
	}
}