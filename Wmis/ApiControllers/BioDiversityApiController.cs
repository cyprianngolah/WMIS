namespace Wmis.ApiControllers
{
	using System.Web.Http;
	using Configuration;
	using Dto;
	using Models;

	/// <summary>
	/// Bio Diversity API Controller
	/// </summary>
	[RoutePrefix("api/biodiversity")]
	public class BioDiversityController : BaseApiController
    {
		public BioDiversityController(WebConfiguration config) 
			: base(config)
		{
		}

		/// <summary>
		/// Gets the list of BioDiversity information based on the searchRequestParameters
		/// </summary>
		/// <param name="searchRequestParameters">The parameters used when searching for BioDiversity data</param>
		/// <returns>The paged data for BioDiversity</returns>
		[HttpGet]
		[Route]
		public PagedResultset<BioDiversity> Get([FromUri]BioDiversitySearchRequest searchRequestParameters)
		{
			return Repository.BioDiversityGet(searchRequestParameters);
		}

		[HttpGet]
		[Route("{bioDiversityKey:int?}")]
		public BioDiversity Get(int bioDiversityKey)
		{
			return Repository.BioDiversityGet(bioDiversityKey);
		}

		[HttpPost]
		[Route]
		public int Create([FromBody]string name)
		{
			return Repository.BioDiversityCreate(name);
		}

		[HttpPut]
		[Route]
		public void Update([FromBody]BioDiversity bd)
		{
			Repository.BioDiversityUpdate(bd);
		}

		[HttpGet]
		[Route("decision/{bioDiversityKey:int?}")]
		public BioDiversityDecisionRequest BioDiversityDecisionGet(int bioDiversityKey)
		{
			var bioDiversity = Repository.BioDiversityGet(bioDiversityKey);
			return new BioDiversityDecisionRequest
			{
				Key = bioDiversity.Key,
                Name = bioDiversity.Name,
                SubSpeciesName = bioDiversity.SubSpeciesName,
                EcoType = bioDiversity.EcoType,
                Population = bioDiversity.Population,
				LastUpdated = bioDiversity.LastUpdated,
				RangeExtentScore = bioDiversity.RangeExtentScore,
				RangeExtentDescription = bioDiversity.RangeExtentDescription,
				AreaOfOccupancyScore = bioDiversity.AreaOfOccupancyScore,
				AreaOfOccupancyDescription = bioDiversity.AreaOfOccupancyDescription,
				PopulationSizeScore = bioDiversity.PopulationSizeScore,
				PopulationSizeDescription = bioDiversity.PopulationSizeDescription,
				NumberOfOccurencesScore = bioDiversity.NumberOfOccurencesScore,
				NumberOfOccurencesDescription = bioDiversity.NumberOfOccurencesDescription,
				EnvironmentalSpecificityScore = bioDiversity.EnvironmentalSpecificityScore,
				EnvironmentalSpecificityDescription = bioDiversity.EnvironmentalSpecificityDescription,
				ShortTermTrendsScore = bioDiversity.ShortTermTrendsScore,
				ShortTermTrendsDescription = bioDiversity.ShortTermTrendsDescription,
				LongTermTrendsScore = bioDiversity.LongTermTrendsScore,
				LongTermTrendsDescription = bioDiversity.LongTermTrendsDescription,
				ThreatsScore = bioDiversity.ThreatsScore,
				ThreatsDescription = bioDiversity.ThreatsDescription,
				IntrinsicVulnerabilityScore = bioDiversity.IntrinsicVulnerabilityScore,
				IntrinsicVulnerabilityDescription = bioDiversity.IntrinsicVulnerabilityDescription,
				NwtStatusRank = bioDiversity.NwtStatusRank,
				SRank = bioDiversity.SRank,
				StatusRank = bioDiversity.StatusRank,
				StatusRankDescription = bioDiversity.StatusRankDescription,
				DecisionProcessDescription = bioDiversity.DecisionProcessDescription,
                NwtSarcAssessment = bioDiversity.NwtSarcAssessment,
				CosewicStatus = bioDiversity.CosewicStatus,
				NRank = bioDiversity.NRank,
				SaraStatus = bioDiversity.SaraStatus,
				IucnStatus = bioDiversity.IucnStatus,
				GRank = bioDiversity.GRank,
			};
		}

		[HttpPut]
		[Route("decision")]
		public void BioDiversityDecisionUpdate([FromBody]BioDiversityDecisionRequest request)
		{
			var bioDiversity = Repository.BioDiversityGet(request.Key);
			bioDiversity.RangeExtentScore = request.RangeExtentScore;
			bioDiversity.RangeExtentDescription = request.RangeExtentDescription;
			bioDiversity.AreaOfOccupancyScore = request.AreaOfOccupancyScore;
			bioDiversity.AreaOfOccupancyDescription = request.AreaOfOccupancyDescription;
			bioDiversity.PopulationSizeScore = request.PopulationSizeScore;
			bioDiversity.PopulationSizeDescription = request.PopulationSizeDescription;
			bioDiversity.NumberOfOccurencesScore = request.NumberOfOccurencesScore;
			bioDiversity.NumberOfOccurencesDescription = request.NumberOfOccurencesDescription;
			bioDiversity.EnvironmentalSpecificityScore = request.EnvironmentalSpecificityScore;
			bioDiversity.EnvironmentalSpecificityDescription = request.EnvironmentalSpecificityDescription;
			bioDiversity.ShortTermTrendsScore = request.ShortTermTrendsScore;
			bioDiversity.ShortTermTrendsDescription = request.ShortTermTrendsDescription;
			bioDiversity.LongTermTrendsScore = request.LongTermTrendsScore;
			bioDiversity.LongTermTrendsDescription = request.LongTermTrendsDescription;
			bioDiversity.ThreatsScore = request.ThreatsScore;
			bioDiversity.ThreatsDescription = request.ThreatsDescription;
			bioDiversity.IntrinsicVulnerabilityScore = request.IntrinsicVulnerabilityScore;
			bioDiversity.IntrinsicVulnerabilityDescription = request.IntrinsicVulnerabilityDescription;
			bioDiversity.NwtStatusRank = request.NwtStatusRank;
			bioDiversity.SRank = request.SRank;
			bioDiversity.StatusRankDescription = request.StatusRankDescription;
			bioDiversity.DecisionProcessDescription = request.DecisionProcessDescription;
            bioDiversity.NwtSarcAssessment = request.NwtSarcAssessment;
			bioDiversity.CosewicStatus = request.CosewicStatus;
			bioDiversity.NRank = request.NRank;
			bioDiversity.SaraStatus = request.SaraStatus;
			bioDiversity.IucnStatus = request.IucnStatus;
			bioDiversity.GRank = request.GRank;
			Repository.BioDiversityUpdate(bioDiversity);
		}
    }
}
