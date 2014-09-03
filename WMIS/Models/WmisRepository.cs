namespace Wmis.Models
{
	using System;
	using System.Collections.Generic;
	using System.Data;
	using System.Data.SqlClient;
    using System.Linq;
    using Configuration;
	using Dapper;
    using Extensions;

	/// <summary>
	/// WMIS Repository for SQL
	/// </summary>
	public class WmisRepository
	{
		#region Fields
		/// <summary>
		/// The Taxonomy Get stored procedure
		/// </summary>
		private const string TAXONOMY_GET = "dbo.Taxonomy_Get";

		/// <summary>
		/// The Taxonomy Update stored procedure
		/// </summary>
		private const string TAXONOMY_SAVE = "dbo.Taxonomy_Save";

		/// <summary>
		/// The Taxonomy Create stored procedure
		/// </summary>
		private const string BIODIVERSITY_CREATE = "dbo.BioDiversity_Create";

		/// <summary>
		/// The BioDiversity Get stored procedure
		/// </summary>
		private const string BIODIVERSITY_GET = "dbo.BioDiversity_Get";

		/// <summary>
		/// The BioDiversity Search stored procedure
		/// </summary>
		private const string BIODIVERSITY_SEARCH = "dbo.BioDiversity_Search";

		/// <summary>
		/// The BioDiversity Update
		/// </summary>
		private const string BIODIVERSITY_UPDATE = "dbo.BioDiversity_Update";

		/// <summary>
		/// The BioDiversity Get Decision stored procedure
		/// </summary>
		private const string BIODIVERSITY_DECISION_GET = "dbo.BioDiversity_Get_Decision";

		/// <summary>
		/// The BioDiversity Decision Update stored procedure
		/// </summary>
		private const string BIODIVERSITY_DECISION_UPDATE = "dbo.BioDiversity_Update_Decision";

        /// <summary>
        /// The Taxonomy Synonym Get stored procedure
        /// </summary>
        private const string TAXONOMYSYNONYM_GET = "dbo.TaxonomySynonym_Get";

        /// <summary>
        /// The Taxonomy Synonym Get stored procedure
        /// </summary>
        private const string TAXONOMYSYNONYM_SAVEMANY = "dbo.TaxonomySynonym_SaveMany";

		/// <summary>
		/// The Taxonomy Groups Get stored procedure
		/// </summary>
		private const string TAXONOMYGROUP_GET = "dbo.TaxonomyGroups_Get";
        
        /// <summary>
		/// The Connection String to connect to the WMIS database for the current environment
		/// </summary>
		private readonly string _connectionString;
		#endregion

		#region Constructors
		/// <summary>
		/// Initializes a new instance of the <see cref="WmisRepository" /> class.
		/// </summary>
		/// <param name="configuration">Configuration information about the current environment</param>
		public WmisRepository(WebConfiguration configuration)
		{
			_connectionString = configuration.ConnectionStrings["WMIS"];
		}
		#endregion

		#region Methods
		#region BioDiversity
		public Dto.PagedResultset<BioDiversity> BioDiversityGet(Dto.BioDiversitySearchRequest sr)
		{
			var pagedResultset = new Dto.PagedResultset<BioDiversity>
			{
				DataRequest = sr,
				ResultCount = 0
			};

			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_startRow = sr.StartRow,
					p_rowCount = sr.RowCount, 
					p_sortBy = sr.SortBy,
					p_sortDirection = sr.SortDirection,
					p_groupKey = sr.GroupKey,
					p_orderKey = sr.OrderKey,
					p_familyKey = sr.FamilyKey,
					p_keywords = string.IsNullOrWhiteSpace(sr.Keywords) ? null : sr.Keywords.Trim()
				};

				var results = c.Query<int, BioDiversity, StatusRank, CosewicStatus, Taxonomy, Taxonomy, dynamic, BioDiversity>(BIODIVERSITY_SEARCH,
					(tc, bd, status, cs, kingdom, phylum, dyn) =>
					{
						pagedResultset.ResultCount = tc;
						bd.StatusRank = status;
						bd.CosewicStatus = cs;
						bd.Kingdom = kingdom ?? new Taxonomy();
						bd.Phylum = phylum ?? new Taxonomy();
						bd.SubPhylum = dyn.SubPhylumKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubPhylumKey, Name = dyn.SubPhylumName };
						bd.Class = dyn.ClassKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.ClassKey, Name = dyn.ClassName };
						bd.SubClass = dyn.SubClassKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubClassKey, Name = dyn.SubClassName };
						bd.Order = dyn.OrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.OrderKey, Name = dyn.OrderName };
						bd.SubOrder = dyn.SubOrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubOrderKey, Name = dyn.SubOrderName };
						bd.InfraOrder = dyn.InfraOrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.InfraOrderKey, Name = dyn.InfraOrderName };
						bd.SuperFamily = dyn.SuperFamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SuperFamilyKey, Name = dyn.SuperFamilyName };
						bd.Family = dyn.FamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.FamilyKey, Name = dyn.FamilyName };
						bd.SubFamily = dyn.SubFamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubFamilyKey, Name = dyn.SubFamilyName };
						bd.Group = dyn.GroupKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.GroupKey, Name = dyn.GroupName };

						bd.LastUpdated = DateTime.UtcNow.AddSeconds(0 - tc);

						return bd;
					}, param, splitOn: "Key", commandType: CommandType.StoredProcedure);

				pagedResultset.Data = new List<BioDiversity>(results);
			}

			return pagedResultset;
		}

		public BioDiversity BioDiversityGet(int bioDiversityKey)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_bioDiversityKey = bioDiversityKey
				};
				return c.Query<BioDiversity, StatusRank, CosewicStatus, Taxonomy, Taxonomy, dynamic, BioDiversity>(BIODIVERSITY_GET,
					(bd, status, cs, kingdom, phylum, dyn) =>
					{
						bd.StatusRank = status;
						bd.CosewicStatus = cs;
						bd.Kingdom = kingdom ?? new Taxonomy();
						bd.Phylum = phylum ?? new Taxonomy();
						bd.SubPhylum = dyn.SubPhylumKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubPhylumKey, Name = dyn.SubPhylumName };
						bd.Class = dyn.ClassKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.ClassKey, Name = dyn.ClassName };
						bd.SubClass = dyn.SubClassKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubClassKey, Name = dyn.SubClassName };
						bd.Order = dyn.OrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.OrderKey, Name = dyn.OrderName };
						bd.SubOrder = dyn.SubOrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubOrderKey, Name = dyn.SubOrderName };
						bd.InfraOrder = dyn.InfraOrderKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.InfraOrderKey, Name = dyn.InfraOrderName };
						bd.SuperFamily = dyn.SuperFamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SuperFamilyKey, Name = dyn.SuperFamilyName };
						bd.Family = dyn.FamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.FamilyKey, Name = dyn.FamilyName };
						bd.SubFamily = dyn.SubFamilyKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.SubFamilyKey, Name = dyn.SubFamilyName };
						bd.Group = dyn.GroupKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.GroupKey, Name = dyn.GroupName };

						bd.LastUpdated = DateTime.UtcNow.AddSeconds(-5);

						return bd;
					}, param, splitOn: "Key", 
					commandType: CommandType.StoredProcedure).FirstOrDefault();
			}
		}

		public void BioDiversityCreate(string name)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_name = name
				};
				c.Execute(BIODIVERSITY_CREATE, param, commandType: CommandType.StoredProcedure);
			}
		}

		public void BioDiversityUpdate(BioDiversity bd)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_speciesId = bd.Key,
					p_Name = bd.Name,
					p_CommonName = bd.CommonName,
					p_SubSpeciesName = bd.SubSpeciesName,
					p_EcoType = bd.EcoType,
					p_Population = bd.Population,
					p_NSGlobalId = bd.NsGlobalId,
					p_NSNWTId = bd.NsNwtId,
					p_ELCODE = bd.Elcode,
					p_KingdomTaxonomyId = bd.Kingdom.Key == 0 ? null : (int?)bd.Kingdom.Key,
					p_PhylumTaxonomyId = bd.Phylum.Key == 0 ? null : (int?)bd.Phylum.Key,
					p_SubPhylumTaxonomyId = bd.SubPhylum.Key == 0 ? null : (int?)bd.SubPhylum.Key,
					p_ClassTaxonomyId = bd.Class.Key == 0 ? null : (int?)bd.Class.Key,
					p_SubClassTaxonomyId = bd.SubClass.Key == 0 ? null : (int?)bd.SubClass.Key,
					p_OrderTaxonomyId = bd.Order.Key == 0 ? null : (int?)bd.Order.Key,
					p_SubOrderTaxonomyId = bd.SubOrder.Key == 0 ? null : (int?)bd.SubOrder.Key,
					p_InfraOrderTaxonomyId = bd.InfraOrder.Key == 0 ? null : (int?)bd.InfraOrder.Key,
					p_SuperFamilyTaxonomyId = bd.SuperFamily.Key == 0 ? null : (int?)bd.SuperFamily.Key,
					p_FamilyTaxonomyId = bd.Family.Key == 0 ? null : (int?)bd.Family.Key,
					p_SubFamilyTaxonomyId = bd.SubFamily.Key == 0 ? null : (int?)bd.SubFamily.Key,
					p_GroupTaxonomyId = bd.Group.Key == 0 ? null : (int?)bd.Group.Key,
					p_NonNTSpecies = bd.NonNtSpecies,
					p_CanadaKnownSubSpeciesCount = bd.CanadaKnownSubSpeciesCount,
					p_CanadaKnownSubSpeciesDescription = bd.CanadaKnownSubSpeciesDescription,
					p_NWTKnownSubSpeciesCount = bd.NwtKnownSubSpeciesCount,
					p_NWTKnownSubSpeciesDescription = bd.NwtKnownSubSpeciesDescription,
					@p_AgeOfMaturity = bd.AgeOfMaturity,
					@p_AgeOfMaturityDescription = bd.AgeOfMaturityDescription,
					@p_ReproductionFrequencyPerYear = bd.ReproductionFrequencyPerYear,
					@p_ReproductionFrequencyPerYearDescription = bd.ReproductionFrequencyPerYearDescription,
					@p_Longevity = bd.Longevity,
					@p_LongevityDescription = bd.LongevityDescription,
					@p_VegetationReproductionDescription = bd.VegetationReproductionDescription,
					@p_HostFishDescription = bd.HostFishDescription,
					@p_OtherReproductionDescription = bd.OtherReproductionDescription,
					@p_EcozoneDescription = bd.EcozoneDescription,
					@p_EcoregionDescription = bd.EcoregionDescription,
					@p_ProtectedAreaDescription = bd.ProtectedAreaDescription,
					@p_RangeExtentScore = bd.RangeExtentScore,
					@p_RangeExtentDescription = bd.RangeExtentDescription,
					@p_DistributionPercentage = bd.DistributionPercentage,
					@p_AreaOfOccupancyScore = bd.AreaOfOccupancyScore,
					@p_AreaOfOccupancyDescription = bd.AreaOfOccupancyDescription,
					@p_HistoricalDistributionDescription = bd.HistoricalDistributionDescription,
					@p_MarineDistributionDescription = bd.MarineDistributionDescription,
					@p_WinterDistributionDescription = bd.WinterDistributionDescription,
					@p_HabitatDescription = bd.HabitatDescription,
					@p_EnvironmentalSpecificityScore = bd.EnvironmentalSpecificityScore,
					@p_EnvironmentalSpecificityDescription = bd.EnvironmentalSpecificityDescription,
					@p_PopulationSizeScore = bd.PopulationSizeScore,
					@p_PopulationSizeDescription = bd.PopulationSizeDescription,
					@p_NumberOfOccurencesScore = bd.NumberOfOccurencesScore,
					@p_NumberOfOccurencesDescription = bd.NumberOfOccurencesDescription,
					@p_DensityDescription = bd.DensityDescription,
					@p_ThreatsScore = bd.ThreatsScore,
					@p_ThreatsDescription = bd.ThreatsDescription,
					@p_IntrinsicVulnerabilityScore = bd.IntrinsicVulnerabilityScore,
					@p_IntrinsicVulnerabilityDescription = bd.IntrinsicVulnerabilityDescription,
					@p_ShortTermTrendsScore = bd.ShortTermTrendsScore,
					@p_ShortTermTrendsDescription = bd.ShortTermTrendsDescription,
					@p_LongTermTrendsScore = bd.LongTermTrendsScore,
					@p_LongTermTrendsDescription = bd.LongTermTrendsDescription,
					@p_StatusRankId = bd.StatusRank == null || bd.StatusRank.Key == 0 ? null : (int?)bd.StatusRank.Key,
					@p_StatusRankDescription = bd.StatusRankDescription,
					@p_SRank = bd.SRank,
					@p_DecisionProcessDescription = bd.DecisionProcessDescription,
					@p_EconomicStatusDescription = bd.EconomicStatusDescription,
					@p_COSEWICStatusId = bd.CosewicStatus == null || bd.CosewicStatus.Key == 0 ? null : (int?)bd.CosewicStatus.Key,
					@p_COSEWICStatusDescription = bd.CosewicStatusDescription,
					@p_NRank = bd.NRank,
					@p_SARAStatus = bd.SaraStatus,
					@p_FederalSpeciesAtRiskStatusDescription = bd.FederalSpeciesAtRiskStatusDescription,
					@p_NWTSARCAssessmentDescription = bd.NwtsarcAssessmentDescription,
					@p_NWTStatusRank = bd.NwtStatusRank,
					@p_NWTSpeciesAtRiskStatusDescription = bd.NwtSpeciesAtRiskStatusDescription,
					@p_CanadianConservationSignificanceDescription = bd.CanadianConservationSignificanceDescription,
					@p_IUCNStatus = bd.IucnStatus,
					@p_GRank = bd.GRank,
					@p_IUCNDescription = bd.IucnDescription
	
				};
				c.Execute(BIODIVERSITY_UPDATE, param, commandType: CommandType.StoredProcedure);
			}
		}

		public BioDiversityDecision BioDiversityDecisionGet(int bioDiversityKey)
		{
			return new BioDiversityDecision();
		}

		public void BioDiversityDecisionUpdate(Dto.BioDiversityDecisionUpdateRequest ur)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					
				};
				c.Execute(BIODIVERSITY_DECISION_UPDATE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region Taxonomy
		/// <summary>
		/// Gets a list of Taxonomies
		/// </summary>
		/// <param name="taxonomyId">The id of the Taxonomy to retrieve, can be null</param>
		/// <param name="taxonomyGroupId">The group id for the Taxonomies to retrieve, can be null </param>
		/// <returns>A list of matching Taxonomies</returns>
		public IEnumerable<Taxonomy> TaxonomyGet(int? taxonomyId = null, int? taxonomyGroupId = null)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyId = taxonomyId,
					p_taxonomyGroupId = taxonomyGroupId
				};
				return c.Query<dynamic, Taxonomy, TaxonomyGroup, Taxonomy>(TAXONOMY_GET,
					(d, t, tg) =>
					{
						t.TaxonomyGroup = tg;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");
			}
		}

		/// <summary>
		/// Gets a list of Taxonomies
		/// </summary>
		/// <param name="tr">The information about the Taxonomy Request</param>
		/// <returns>A list of matching Taxonomies</returns>
		public Dto.PagedResultset<Taxonomy> TaxonomyGet(Dto.TaxonomyRequest tr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = tr.StartRow,
					p_to = tr.StartRow + tr.RowCount - 1,
					p_sortBy = tr.SortBy,
					p_sortDirection = tr.SortDirection,
					p_keywords = tr.Keywords,
					p_taxonomyId = tr.TaxonomyKey,
					p_taxonomyGroupId = tr.TaxonomyGroupKey
				};

				var pagedResults = new Dto.PagedResultset<Taxonomy>
				{
					DataRequest = tr,
					ResultCount = 0,
					Data = new List<Taxonomy>()
				};

				var results = c.Query<dynamic, Taxonomy, TaxonomyGroup, Taxonomy>(TAXONOMY_GET,
					(d, t, tg) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						t.TaxonomyGroup = tg;
						return t;
					}, param, commandType: CommandType.StoredProcedure, splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Gets a list of Taxonomy Groups
		/// </summary>
		/// <param name="taxonomyGroupKey"></param>
		/// <returns>A list of matching Taxonomy Groups</returns>
		public IEnumerable<TaxonomyGroup> TaxonomyGroupGet(int? taxonomyGroupKey = null)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyGroupId = taxonomyGroupKey
				};

				return c.Query<TaxonomyGroup>(TAXONOMYGROUP_GET, param, commandType: CommandType.StoredProcedure);
			}
		}

        /// <summary>
        /// Gets a list of Taxonomy Synonyms
        /// </summary>
        /// <param name="taxonomyId">The id of the Taxonomy to retrieve synonyms for, can be null</param>
        /// <returns>A list of matching Taxonomies</returns>
        public IEnumerable<TaxonomySynonym> TaxonomySynonymGet(int taxonomyId)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_taxonomyId = taxonomyId
                };
                return c.Query<TaxonomySynonym>(TAXONOMYSYNONYM_GET, param, commandType: CommandType.StoredProcedure);
            }
        }

		public void TaxonomySave(Dto.TaxonomySaveRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_taxonomyId = sr.TaxonomyKey,
					p_taxonomyGroupId = sr.TaxonomyGroupKey,
					p_name = sr.Name
				};

				c.Execute(TAXONOMY_SAVE, param, commandType: CommandType.StoredProcedure);
			}
		}

	    /// <summary>
	    /// Gets a list of Taxonomy Synonyms
	    /// </summary>
	    /// <param name="taxonomyId">The id of the Taxonomy to save synonyms for</param>
	    /// <param name="synonyms">The complete list of synonyms for the specified Taxonomy</param>
	    public void TaxonomySynonymSaveMany(int taxonomyId, IEnumerable<string> synonyms)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_taxonomyId = taxonomyId,
                    p_taxonomySynonyms = synonyms.Select(i => new { Name = i }).AsTableValuedParameter("dbo.TaxonomySynonymType")
                };
                c.Execute(TAXONOMYSYNONYM_SAVEMANY, param, commandType: CommandType.StoredProcedure);
            }
        }
		#endregion

		#endregion

		#region Helpers
		/// <summary>
		/// Gets a new SQLConnection to the WMIS Database for the current environment
		/// </summary>
		private SqlConnection NewWmisConnection
		{
			get { return new SqlConnection(_connectionString); }
		}
		#endregion
	}
}