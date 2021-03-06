namespace Wmis.Dto
{
	using System;
	using System.Collections.Generic;

	using Models;

	public class BioDiversityDecisionRequest
	{
		public int Key { get; set; }

        public string Name { get; set; }

        public string SubSpeciesName { get; set; }

        public string EcoType { get; set; }

        public List<string> Populations { get; set; }

		public DateTime LastUpdated { get; set; }

		public string RangeExtentScore { get; set; }

        public string RangeExtentDescription { get; set; }

        public string AreaOfOccupancyScore { get; set; }

        public string AreaOfOccupancyDescription { get; set; }

        public string PopulationSizeScore { get; set; }

        public string PopulationSizeDescription { get; set; }

        public string NumberOfOccurencesScore { get; set; }

        public string NumberOfOccurencesDescription { get; set; }

        public string EnvironmentalSpecificityScore { get; set; }

        public string EnvironmentalSpecificityDescription { get; set; }

        public string ShortTermTrendsScore { get; set; }

        public string ShortTermTrendsDescription { get; set; }

        public string LongTermTrendsScore { get; set; }

        public string LongTermTrendsDescription { get; set; }

        public string ThreatsScore { get; set; }

        public string ThreatsDescription { get; set; }

        public string IntrinsicVulnerabilityScore { get; set; }

        public string IntrinsicVulnerabilityDescription { get; set; }

        public NwtStatusRank NwtStatusRank { get; set; }

		public string SRank { get; set; }

		public StatusRank StatusRank { get; set; }

		public string StatusRankDescription { get; set; }

		public string DecisionProcessDescription { get; set; }

        public NwtSarcAssessment NwtSarcAssessment { get; set; }

		public CosewicStatus CosewicStatus { get; set; }

		public string NRank { get; set; }

        public SaraStatus SaraStatus { get; set; }

		public string IucnStatus { get; set; }

		public string GRank { get; set; }

        public string CommonName { get; set; }
	}
}