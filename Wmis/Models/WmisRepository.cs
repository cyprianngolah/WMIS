﻿namespace Wmis.Models
{
	using System;
	using System.Collections.Generic;
	using System.Data;
	using System.Data.SqlClient;
    using System.Linq;
	using Configuration;
	using Dapper;
	using Dto;
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
		/// The BioDiversity Get All stored procedure
		/// </summary>
		private const string BIODIVERSITY_GETALL = "dbo.BioDiversity_GetAll";

		/// <summary>
		/// The BioDiversity Search stored procedure
		/// </summary>
		private const string BIODIVERSITY_SEARCH = "dbo.BioDiversity_Search";

		/// <summary>
		/// The BioDiversity Update
		/// </summary>
		private const string BIODIVERSITY_UPDATE = "dbo.BioDiversity_Update";

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
        /// The Species Synonym Get stored procedure
        /// </summary>
        private const string SPECIESSYNONYM_GET = "dbo.SpeciesSynonym_Get";

        /// <summary>
        /// The Species Synonym Get stored procedure
        /// </summary>
        private const string SPECIESSYNONYM_SAVEMANY = "dbo.SpeciesSynonym_SaveMany";

        /// <summary>
		/// The Ecoregion Get stored procedure
		/// </summary>
		private const string ECOREGION_GET = "dbo.Ecoregion_Get";
        
		/// <summary>
		/// The Ecoregion Save stored procedure
		/// </summary>
		private const string ECOREGION_SAVE = "dbo.Ecoregion_Save";
        
		/// <summary>
		/// The Ecozone Get stored procedure
		/// </summary>
		private const string ECOZONE_GET = "dbo.Ecozone_Get";

		/// <summary>
		/// The Ecozone Save stored procedure
		/// </summary>
		private const string ECOZONE_SAVE = "dbo.Ecozone_Save";

        /// <summary>
        /// The NWT SARC Assessment Get stored procedure
        /// </summary>
        private const string NWTSARCASSESSMENT_GET = "dbo.NwtSarcAssessment_Get";

        /// <summary>
        /// The NWT SARC Assessment Save stored procedure
        /// </summary>
        private const string NWTSARCASSESSMENT_SAVE = "dbo.NwtSarcAssessment_Save";

		/// <summary>
		/// The Protected Area Get stored procedure
		/// </summary>
		private const string PROTECTEDAREA_GET = "dbo.ProtectedArea_Get";

		/// <summary>
		/// The Protected Area Save stored procedure
		/// </summary>
		private const string PROTECTEDAREA_SAVE = "dbo.ProtectedArea_Save";

		/// <summary>
		/// The COSEWIC Status Get stored procedure
		/// </summary>
		private const string COSEWICSTATUS_GET = "dbo.CosewicStatus_Get";

        /// <summary>
        /// The COSEWIC Status Save stored procedure
        /// </summary>
        private const string COSEWICSTATUS_SAVE = "dbo.CosewicStatus_Save";

		/// <summary>
		/// The Status Rank Get stored procedure
		/// </summary>
		private const string STATUSRANK_GET = "dbo.StatusRank_Get";

		/// <summary>
		/// The Reference Get stored procedure
		/// </summary>
		private const string REFERENCE_GET = "dbo.Reference_Get";

		/// <summary>
		/// Create/Update References stored procedure
		/// </summary>
		private const string REFERENCE_SAVE = "dbo.Reference_Save";

        /// <summary>
        /// The Status Rank Save stored procedure
        /// </summary>
        private const string STATUSRANK_SAVE = "dbo.StatusRank_Save";

		private const string PROJECTSTATUS_SEARCH = "dbo.ProjectStatus_Search";

		private const string LEADREGION_SEARCH = "dbo.LeadRegion_Search";

		private const string PERSON_SEARCH = "dbo.Person_Search";

		private const string PROJECT_CREATE = "dbo.Project_Create";

		private const string PROJECT_UPDATE = "dbo.Project_Update";

		private const string PROJECT_GET = "dbo.Project_Get";

		private const string PROJECT_SEARCH = "dbo.Project_Search";

		private const string SURVEY_SAVE = "dbo.Survey_Save";

		private const string SURVEY_GET = "dbo.Survey_Get";

		private const string SURVEY_SEARCH = "dbo.Survey_Search";

		private const string SURVEYTYPE_SEARCH = "dbo.SurveyType_Search";

		private const string SURVEYTEMPLATE_SEARCH = "dbo.SurveyTemplate_Search";

        /// <summary>
        /// The Collar Update stored procedure
        /// </summary>
	    private const string COLLAR_UPDATE = "dbo.Collar_Update";

        /// <summary>
        /// The Collar Create stored procedure
        /// </summary>
        private const string COLLAR_CREATE = "dbo.Collar_Create";

        /// <summary>
        /// The Collar Get stored procedure
        /// </summary>
        private const string COLLAR_GET = "dbo.Collar_Get";
        
        /// <summary>
        /// The Collar Search stored procedure
        /// </summary>
        private const string COLLAR_SEARCH = "dbo.Collar_Search";

        /// <summary>
        /// The Collar Type Get stored procedure
        /// </summary>
        private const string COLLARTYPE_GET = "dbo.CollarType_Get";

        /// <summary>
        /// The Collar Region Get stored procedure
        /// </summary>
        private const string COLLARREGION_GET = "dbo.CollarRegion_Get";

        /// <summary>
        /// The Collar Status Get stored procedure
        /// </summary>
        private const string COLLARSTATUS_GET = "dbo.CollarStatus_Get";

        /// <summary>
        /// The Collar State Get stored procedure
        /// </summary>
        private const string COLLARSTATE_GET = "dbo.CollarState_Get";

        /// <summary>
        /// The Collar Malfunction Get stored procedure
        /// </summary>
        private const string COLLARMALFUNCTION_GET = "dbo.CollarMalfunction_Get";

        /// <summary>
        /// The Collar History Search stored procedure
        /// </summary>
        private const string COLLARHISTORY_SEARCH = "dbo.CollarHistory_Search";

        /// <summary>
        /// The Collar Save stored procedure
        /// </summary>
        private const string COLLARHISTORY_SAVE = "dbo.CollarHistory_Save";

        private const string ARGOSPASS_CREATE = "dbo.ArgosPass_Create";

        private const string ARGOSPASS_UPDATE = "dbo.ArgosPass_Update";

        private const string ARGOSPASS_SEARCH = "dbo.ArgosPass_Search";

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

			ILookup<int, Population> populationRecords;

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

                using (var q = c.QueryMultiple(BIODIVERSITY_SEARCH, param, commandType: CommandType.StoredProcedure))
                {
                    pagedResultset.Data = q.Read<int, BioDiversity, SaraStatus, NwtStatusRank, StatusRank, CosewicStatus, dynamic, BioDiversity>(
                    (tc, bd, saraStatus, nwtStatusRank, status, cs, dyn) =>
                        {
                            pagedResultset.ResultCount = tc;
                            bd.SaraStatus = saraStatus ?? new SaraStatus();
                            bd.NwtStatusRank = nwtStatusRank ?? new NwtStatusRank();
                            bd.StatusRank = status ?? new StatusRank();
                            bd.CosewicStatus = cs ?? new CosewicStatus();
                            bd.Kingdom = dyn.KingdomKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.KingdomKey, Name = dyn.KingdomName };
                            bd.Phylum = dyn.PhylumKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.PhylumKey, Name = dyn.PhylumName };
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

                            return bd;
                        }, 
                        "Key").ToList();

					populationRecords = q.Read<Population>().ToLookup<Population, int, Population>(p => p.Key, p => p);
                }
            }
			pagedResultset.Data.ForEach(bd => bd.Populations = new List<string>(populationRecords[bd.Key].Select(x=>x.Name)));
			
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
				
				using (var q = c.QueryMultiple(BIODIVERSITY_GET, param, commandType: CommandType.StoredProcedure))
				{
					var biodiversity = q.Read<BioDiversity, SaraStatus, NwtStatusRank, StatusRank, CosewicStatus, NwtSarcAssessment, dynamic, BioDiversity>(
						(bd, saraStatus, nwtStatusRank, status, cs, nsa, dyn) =>
						    {
						    bd.SaraStatus = saraStatus ?? new SaraStatus();
						    bd.NwtStatusRank = nwtStatusRank ?? new NwtStatusRank();
							bd.StatusRank = status ?? new StatusRank();
                            bd.CosewicStatus = cs ?? new CosewicStatus();
                            bd.NwtSarcAssessment = nsa ?? new NwtSarcAssessment();
                            bd.Kingdom = dyn.KingdomKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.KingdomKey, Name = dyn.KingdomName };
                            bd.Phylum = dyn.PhylumKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.PhylumKey, Name = dyn.PhylumName };
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

							return bd;
						}, 
						"Key").SingleOrDefault();

					if (biodiversity != null)
					{
						biodiversity.Ecozones = q.Read<Ecozone>().ToList();
						biodiversity.Ecoregions = q.Read<Ecoregion>().ToList();
						biodiversity.ProtectedAreas = q.Read<ProtectedArea>().ToList();
						biodiversity.Populations = q.Read<string>().ToList();
						biodiversity.References = q.Read<BioDiversityReference, Reference, BioDiversityReference>((br, r) =>
						{
							br.Reference = r;
							return br;
						}, 
						"Key").ToList();
					}

					return biodiversity;
				}
			}
		}
        
        public IEnumerable<BioDiversity> BioDiversityGetAll()
		{
			using (var c = NewWmisConnection)
			{
				var param = new {};

                using (var q = c.QueryMultiple(BIODIVERSITY_GETALL, param, commandType: CommandType.StoredProcedure))
				{
					var biodiversityItems = q.Read<BioDiversity, SaraStatus, NwtStatusRank, StatusRank, CosewicStatus, NwtSarcAssessment, dynamic, BioDiversity>(
						(bd, saraStatus, nwtStatusRank, status, cs, nsa, dyn) =>
						    {
						    bd.SaraStatus = saraStatus ?? new SaraStatus();
						    bd.NwtStatusRank = nwtStatusRank ?? new NwtStatusRank();
							bd.StatusRank = status ?? new StatusRank();
                            bd.CosewicStatus = cs ?? new CosewicStatus();
                            bd.NwtSarcAssessment = nsa ?? new NwtSarcAssessment();
                            bd.Kingdom = dyn.KingdomKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.KingdomKey, Name = dyn.KingdomName };
                            bd.Phylum = dyn.PhylumKey == null ? new Taxonomy() : new Taxonomy { Key = dyn.PhylumKey, Name = dyn.PhylumName };
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

							return bd;
						}, 
						"Key").ToList();

                    var speciesEcozones = q.Read<SpeciesEcozone>().ToLookup(se => se.SpeciesId);
                    var speciesEcoregions = q.Read<SpeciesEcoregion>().ToLookup(se => se.SpeciesId);
                    var speciesProtectedAreas = q.Read<SpeciesProtectedArea>().ToLookup(spa => spa.SpeciesId);
                    var speciesPopulations = q.Read<SpeciesPopulation>().ToLookup(sp => sp.SpeciesId);

                    var speciesBioDiversityReference = q.Read<SpeciesBioDiversityReference, Reference, SpeciesBioDiversityReference>((sbr, r) => {
                        sbr.Reference = r;
                        return sbr;
                    },
                    "Key").ToLookup(sbdr => sbdr.SpeciesId);
				   
				    biodiversityItems.ForEach(bd => {
			            bd.Ecozones = speciesEcozones[bd.Key].Select(se => new Ecozone { Key = se.Key, Name = se.Name }).ToList();
                        bd.Ecoregions = speciesEcoregions[bd.Key].Select(se => new Ecoregion { Key = se.Key, Name = se.Name }).ToList();
                        bd.ProtectedAreas = speciesProtectedAreas[bd.Key].Select(spa => new ProtectedArea { Key = spa.Key, Name = spa.Name }).ToList();
                        bd.Populations = speciesPopulations[bd.Key].Select(sp => sp.Name).ToList();
                        bd.References = speciesBioDiversityReference[bd.Key].Select(sbdr => new BioDiversityReference{CategoryKey = sbdr.CategoryKey, Reference = sbdr.Reference}).ToList();
				    });

					return biodiversityItems;
				}
			}
		}

        public int BioDiversityCreate(BioDiversityNew bdn)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_name = bdn.Name,
					p_subSpeciesName = bdn.SubSpeciesName,
                    p_ecoType = bdn.EcoType
				};
				return c.Query<int>(BIODIVERSITY_CREATE, param, commandType: CommandType.StoredProcedure).Single();
			}
		}

		public DateTime BioDiversityUpdate(BioDiversity bd)
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
					p_AgeOfMaturity = bd.AgeOfMaturity,
					p_AgeOfMaturityDescription = bd.AgeOfMaturityDescription,
					p_ReproductionFrequencyPerYear = bd.ReproductionFrequencyPerYear,
					p_ReproductionFrequencyPerYearDescription = bd.ReproductionFrequencyPerYearDescription,
					p_Longevity = bd.Longevity,
					p_LongevityDescription = bd.LongevityDescription,
					p_VegetationReproductionDescription = bd.VegetationReproductionDescription,
					p_HostFishDescription = bd.HostFishDescription,
					p_OtherReproductionDescription = bd.OtherReproductionDescription,
					p_EcozoneDescription = bd.EcozoneDescription,
					p_EcoregionDescription = bd.EcoregionDescription,
					p_ProtectedAreaDescription = bd.ProtectedAreaDescription,
					p_RangeExtentScore = bd.RangeExtentScore,
					p_RangeExtentDescription = bd.RangeExtentDescription,
					p_DistributionPercentage = bd.DistributionPercentage,
					p_AreaOfOccupancyScore = bd.AreaOfOccupancyScore,
					p_AreaOfOccupancyDescription = bd.AreaOfOccupancyDescription,
					p_HistoricalDistributionDescription = bd.HistoricalDistributionDescription,
					p_MarineDistributionDescription = bd.MarineDistributionDescription,
					p_WinterDistributionDescription = bd.WinterDistributionDescription,
					p_HabitatDescription = bd.HabitatDescription,
					p_EnvironmentalSpecificityScore = bd.EnvironmentalSpecificityScore,
					p_EnvironmentalSpecificityDescription = bd.EnvironmentalSpecificityDescription,
					p_PopulationSizeScore = bd.PopulationSizeScore,
					p_PopulationSizeDescription = bd.PopulationSizeDescription,
					p_NumberOfOccurencesScore = bd.NumberOfOccurencesScore,
					p_NumberOfOccurencesDescription = bd.NumberOfOccurencesDescription,
					p_DensityDescription = bd.DensityDescription,
					p_ThreatsScore = bd.ThreatsScore,
					p_ThreatsDescription = bd.ThreatsDescription,
					p_IntrinsicVulnerabilityScore = bd.IntrinsicVulnerabilityScore,
					p_IntrinsicVulnerabilityDescription = bd.IntrinsicVulnerabilityDescription,
					p_ShortTermTrendsScore = bd.ShortTermTrendsScore,
					p_ShortTermTrendsDescription = bd.ShortTermTrendsDescription,
					p_LongTermTrendsScore = bd.LongTermTrendsScore,
					p_LongTermTrendsDescription = bd.LongTermTrendsDescription,
					p_StatusRankId = bd.StatusRank == null || bd.StatusRank.Key == 0 ? null : (int?)bd.StatusRank.Key,
					p_StatusRankDescription = bd.StatusRankDescription,
					p_SRank = bd.SRank,
					p_DecisionProcessDescription = bd.DecisionProcessDescription,
					p_EconomicStatusDescription = bd.EconomicStatusDescription,
					p_COSEWICStatusId = bd.CosewicStatus == null || bd.CosewicStatus.Key == 0 ? null : (int?)bd.CosewicStatus.Key,
					p_COSEWICStatusDescription = bd.CosewicStatusDescription,
					p_NRank = bd.NRank,
                    p_SARAStatusId = bd.SaraStatus == null || bd.SaraStatus.Key == 0 ? null : (int?)bd.SaraStatus.Key,
					p_FederalSpeciesAtRiskStatusDescription = bd.FederalSpeciesAtRiskStatusDescription,
                    p_NwtSarcAssessmentId = bd.NwtSarcAssessment == null || bd.NwtSarcAssessment.Key == 0 ? null : (int?)bd.NwtSarcAssessment.Key,
					p_NWTSARCAssessmentDescription = bd.NwtsarcAssessmentDescription,
					p_NWTStatusRankId = bd.NwtStatusRank == null || bd.NwtStatusRank.Key == 0 ? null : (int?)bd.NwtStatusRank.Key,
					p_NWTSpeciesAtRiskStatusDescription = bd.NwtSpeciesAtRiskStatusDescription,
					p_IUCNStatus = bd.IucnStatus,
					p_GRank = bd.GRank,
					p_IUCNDescription = bd.IucnDescription,
					p_ecozones = bd.Ecozones.Select(i => new { n = i.Key }).AsTableValuedParameter("dbo.IntTableType"),
					p_ecoregions = bd.Ecoregions.Select(i => new { n = i.Key }).AsTableValuedParameter("dbo.IntTableType"),
					p_protectedAreas = bd.ProtectedAreas.Select(i => new { n = i.Key }).AsTableValuedParameter("dbo.IntTableType"),
					p_populations = bd.Populations.Select(i => new { Name = i}).AsTableValuedParameter("dbo.NameTableType"),
					p_references = bd.References.Select(i => new { n = i.CategoryKey, p = i.Reference.Key }).AsTableValuedParameter("dbo.TwoIntTableType")
				};
				return c.Query<DateTime>(BIODIVERSITY_UPDATE, param, commandType: CommandType.StoredProcedure).FirstOrDefault();
			}
		}

        /// <summary>
        /// Gets a list of Species Synonyms
        /// </summary>
        /// <param name="speciesId">The id of the Species to retrieve synonyms for</param>
        /// <param name="speciesSynonymTypeId">The id of the Species Synonym Type to retrieve synonyms for, optional</param>
        /// <returns>A list of matching Species Synonyms</returns>
        public IEnumerable<SpeciesSynonym> SpeciesSynonymGet(int speciesId, int? speciesSynonymTypeId = null)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_speciesId = speciesId,
                    p_speciesSynonymTypeId = speciesSynonymTypeId
                };
                return c.Query<SpeciesSynonym>(SPECIESSYNONYM_GET, param, commandType: CommandType.StoredProcedure);
            }
        }

        /// <summary>
        /// Gets save a list of Species Synonyms
        /// </summary>
        /// <param name="speciesId">The id of the Species to save synonyms for</param>
        /// <param name="speciesSynonymTypeId">The id of the Species Synonym Type to save synonyms for</param>
        /// <param name="synonyms">The complete list of synonyms for the specified Species/Species Synonym Type</param>
        public void SpeciesSynonymSaveMany(int speciesId, int speciesSynonymTypeId, IEnumerable<string> synonyms)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_speciesId = speciesId,
                    p_speciesSynonymTypeId = speciesSynonymTypeId,
                    p_speciesSynonyms = synonyms.Select(i => new { Name = i }).AsTableValuedParameter("dbo.SpeciesSynonymType")
                };
                c.Execute(SPECIESSYNONYM_SAVEMANY, param, commandType: CommandType.StoredProcedure);
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
					}, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");
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
					}, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Gets a list of Taxonomy Groups
		/// </summary>
		/// <param name="taxonomyGroupKey">The Taxonomy Group Key</param>
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
	    /// Save a list of Taxonomy Synonyms
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

		#region Ecoregion
		/// <summary>
		/// Gets a list of Eco-regions
		/// </summary>
		/// <param name="request">The information about the Eco-region Request</param>
		/// <returns>A list of matching Eco-regions</returns>
		public PagedResultset<Ecoregion> EcoregionGet(EcoregionRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_ecoregionId = request.Key,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<Ecoregion>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<Ecoregion>()
				};

				var results = c.Query<dynamic, Ecoregion, Ecoregion>(ECOREGION_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Saves the Ecoregion
		/// </summary>
		/// <param name="request">The information about the Ecoregion Request</param>
		public void EcoregionSave(EcoregionSaveRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_ecoregionId = request.Key,
					p_name = request.Name
				};

				c.Execute(ECOREGION_SAVE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region Ecozone
		/// <summary>
		/// Gets a list of Eco-zones
		/// </summary>
		/// <param name="request">The information about the Eco-zone Request</param>
		/// <returns>A list of matching Eco-zones</returns>
		public PagedResultset<Ecozone> EcozoneGet(EcozoneRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_ecozoneId = request.Key,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<Ecozone>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<Ecozone>()
				};

				var results = c.Query<dynamic, Ecozone, Ecozone>(ECOZONE_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Saves the Ecozone
		/// </summary>
		/// <param name="request">The information about the Ecozone Request</param>
		public void EcozoneSave(EcozoneSaveRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_ecozoneId = request.Key,
					p_name = request.Name
				};

				c.Execute(ECOZONE_SAVE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

        #region NwtSarcAssessment
        /// <summary>
        /// Gets a list of NWT SARC Assessments
        /// </summary>
        /// <param name="request">The information about the NWT SARC Assessment Request</param>
        /// <returns>A list of matching NWT SARC Assessments</returns>
        public PagedResultset<NwtSarcAssessment> NwtSarcAssessmentGet(NwtSarcAssessmentRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                    p_nwtSarcAssessmentId = request.Key,
                    p_keywords = request.Keywords,
                };

                var pagedResults = new PagedResultset<NwtSarcAssessment>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<NwtSarcAssessment>()
                };

                var results = c.Query<dynamic, NwtSarcAssessment, NwtSarcAssessment>(NWTSARCASSESSMENT_GET,
                    (d, t) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return t;
                    }, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        /// <summary>
        /// Saves the Ecozone
        /// </summary>
        /// <param name="request">The information about the NWT SARC Assessment Request</param>
        public void NwtSarcAssessmentSave(NwtSarcAssessmentSaveRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_nwtSarcAssessmentId = request.Key,
                    p_name = request.Name
                };

                c.Execute(NWTSARCASSESSMENT_SAVE, param, commandType: CommandType.StoredProcedure);
            }
        }
        #endregion

		#region ProtectedArea
		/// <summary>
		/// Gets a list of Protected Areas
		/// </summary>
		/// <param name="request">The information about the Protected Area Request</param>
		/// <returns>A list of matching Protected Areas</returns>
		public PagedResultset<ProtectedArea> ProtectedAreaGet(ProtectedAreaRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = request.StartRow,
					p_to = request.StartRow + request.RowCount - 1,
					p_sortBy = request.SortBy,
					p_sortDirection = request.SortDirection,
					p_protectedAreaId = request.Key,
					p_keywords = request.Keywords,
				};

				var pagedResults = new PagedResultset<ProtectedArea>
				{
					DataRequest = request,
					ResultCount = 0,
					Data = new List<ProtectedArea>()
				};

				var results = c.Query<dynamic, ProtectedArea, ProtectedArea>(PROTECTEDAREA_GET,
					(d, t) =>
					{
						pagedResults.ResultCount = d.TotalRowCount;
						return t;
					}, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

				pagedResults.Data = results.ToList();
				return pagedResults;
			}
		}

		/// <summary>
		/// Saves the Protected Area
		/// </summary>
		/// <param name="request">The information about the Protected Area Request</param>
		public void ProtectedAreaSave(ProtectedAreaSaveRequest request)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_protectedAreaId = request.Key,
					p_name = request.Name
				};

				c.Execute(PROTECTEDAREA_SAVE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region CosewicStatus
        /// <summary>
        /// Gets a list of Cosewic Status
        /// </summary>
        /// <param name="request">The information about the Cosewic Status Request</param>
        /// <returns>A list of matching Cosewic Status</returns>
        public PagedResultset<CosewicStatus> CosewicStatusGet(CosewicStatusRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                    p_cosewicStatusId = request.Key,
                    p_keywords = request.Keywords,
                };

                var pagedResults = new PagedResultset<CosewicStatus>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CosewicStatus>()
                };

                var results = c.Query<dynamic, CosewicStatus, CosewicStatus>(COSEWICSTATUS_GET,
                    (d, t) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return t;
                    }, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        /// <summary>
        /// Saves the Cosewic Status
        /// </summary>
        /// <param name="request">The information about the Cosewic Status Request</param>
        public void CosewicStatusSave(CosewicStatusSaveRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_cosewicStatusId = request.Key,
                    p_name = request.Name
                };

                c.Execute(COSEWICSTATUS_SAVE, param, commandType: CommandType.StoredProcedure);
            }
        }
		#endregion

		#region StatusRank
        /// <summary>
        /// Gets a list of Status Ranks
        /// </summary>
        /// <param name="request">The information about the Status Rank Request</param>
        /// <returns>A list of matching Status Ranks</returns>
        public PagedResultset<StatusRank> StatusRankGet(StatusRankRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                    p_statusRankId = request.Key,
                    p_keywords = request.Keywords,
                };

                var pagedResults = new PagedResultset<StatusRank>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<StatusRank>()
                };

                var results = c.Query<dynamic, StatusRank, StatusRank>(STATUSRANK_GET,
                    (d, t) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return t;
                    }, 
					param, 
					commandType: CommandType.StoredProcedure, 
					splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        /// <summary>
        /// Saves the StatusRank
        /// </summary>
        /// <param name="request">The information about the StatusRank Request</param>
        public void StatusRankSave(StatusRankSaveRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_statusRankId = request.Key,
                    p_name = request.Name
                };

                c.Execute(STATUSRANK_SAVE, param, commandType: CommandType.StoredProcedure);
            }
        }
		#endregion

		#region References
		public Dto.PagedResultset<Reference> ReferencesGet(Dto.ReferenceRequest rr) 
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_referenceId = rr.ReferenceKey,
					p_startRow = rr.StartRow,
					p_rowCount = rr.RowCount,
					p_searchString = rr.SearchString
				};

				var pagedResults = new Dto.PagedResultset<Reference> { DataRequest = rr };
				pagedResults.Data = c.Query<int, Reference, Reference>(REFERENCE_GET, 
					(count, r) =>
						{
							pagedResults.ResultCount = count;
							return r;
						},  
					param, 
					commandType: 
					CommandType.StoredProcedure, 
					splitOn: "Key").ToList();

				return pagedResults;
			}
		}

		public void ReferenceSave(Models.Reference r)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_referenceId = r.Key == 0 ? null : (int?)r.Key,
					p_code = r.Code, 
					p_author = r.Author,
					p_year = r.Year,
					p_title = r.Title,
					p_editionPublicationOrganization = r.EditionPublicationOrganization,
					p_volumePage = r.VolumePage,
					p_publisher = r.Publisher,
					p_city = r.City,
					p_location = r.Location
				};
				
				c.Execute(REFERENCE_SAVE, param, commandType: CommandType.StoredProcedure);
			}
		}
		#endregion

		#region Project
		public int ProjectCreate(string name)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_name = name
				};
				return c.Query<int>(PROJECT_CREATE, param, commandType: CommandType.StoredProcedure).Single();
			}
		}

		public void ProjectUpdate(Models.Project project)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_projectId = project.Key,
					p_wildlifeResearchPermitId = project.WildlifeResearchPermitId,
					p_name = project.Name,
					p_leadRegionId = project.LeadRegion.Key == 0 ? null : (int?)project.LeadRegion.Key,
					p_projectStatusId = project.Status.Key == 0 ? null : (int?)project.Status.Key,
					p_statusDate = project.StatusDate,
					p_projectLeadId = project.ProjectLead.Key == 0 ? null : (int?)project.ProjectLead.Key,
					p_startDate = project.StartDate,
					p_endDate = project.EndDate,
					p_isSensitiveData = project.IsSensitiveData,
					p_description = project.Description,
					p_objectives = project.Objectives,
					p_studyArea = project.StudyArea,
					p_methods = project.Methods,
					p_comments = project.Comments,
					p_results = project.Results
				};
				c.Execute(PROJECT_UPDATE, param, commandType: CommandType.StoredProcedure);
			}
		}

		public Project ProjectGet(int projectKey)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_projectId = projectKey
				};
				return c.Query<Project, LeadRegion, Person, ProjectStatus, Project>(PROJECT_GET,
					(p, lr, lead, status) =>
						{
							p.LeadRegion = lr ?? new LeadRegion();
							p.ProjectLead = lead ?? new Person();
							p.Status = status ?? new ProjectStatus();
							return p;
						}, 
						param, 
						commandType: CommandType.StoredProcedure, 
						splitOn: "Key").Single();
			}
		}

		public Dto.PagedResultset<Project> ProjectSearch(Dto.ProjectRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_startRow = sr.StartRow,
					p_rowCount = sr.RowCount,
					p_sortBy = sr.SortBy,
					p_sortDirection = sr.SortDirection,
					p_projectLeadId = sr.ProjectLead,
					p_projectStatusId = sr.ProjectStatus,
					p_leadRegionId = sr.Region,
					p_keywords = string.IsNullOrWhiteSpace(sr.Keywords) ? null : sr.Keywords
				};

				var pr = new Dto.PagedResultset<Project> { DataRequest = sr };
				pr.Data = c.Query<int, Project, LeadRegion, Person, ProjectStatus, Project>(
					PROJECT_SEARCH,
					(count, p, lr, lead, status) =>
						{
							pr.ResultCount = count;
							p.LeadRegion = lr ?? new LeadRegion();
							p.ProjectLead = lead ?? new Person();
							p.Status = status ?? new ProjectStatus();
							return p;
						},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key").ToList();

				return pr;
			}
		}
		#endregion

		#region Project Status
		public Dto.PagedResultset<ProjectStatus> ProjectStatusSearch(Dto.ProjectStatusRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = sr.StartRow,
					p_to = sr.RowCount,
					p_sortBy = sr.SortBy,
					p_sortDirection = sr.SortDirection,
				};

				var pr = new Dto.PagedResultset<ProjectStatus> { DataRequest = sr };

				var results = c.Query<int, ProjectStatus, ProjectStatus>(
					PROJECTSTATUS_SEARCH,
					(count, ps) =>
					{
						pr.ResultCount = count;
						return ps;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key");

				pr.Data = new List<ProjectStatus>(results);

				return pr;
			}
		}
		#endregion

		#region Person
		public Dto.PagedResultset<Person> PersonSearch(Dto.PersonRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = sr.StartRow,
					p_to = sr.RowCount,
					p_sortBy = sr.SortBy,
					p_sortDirection = sr.SortDirection,
				};

				var pr = new Dto.PagedResultset<Person> { DataRequest = sr };

				var results = c.Query<int, Person, Person>(
					PERSON_SEARCH,
					(count, p) =>
					{
						pr.ResultCount = count;
						return p;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key");

				pr.Data = new List<Person>(results);

				return pr;
			}
		}
		#endregion

		#region Lead Region 
		public Dto.PagedResultset<LeadRegion> LeadRegionSearch(Dto.LeadRegionRequest sr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = sr.StartRow,
					p_to = sr.RowCount,
					p_sortBy = sr.SortBy,
					p_sortDirection = sr.SortDirection,
				};

				var pr = new Dto.PagedResultset<LeadRegion> { DataRequest = sr };

				var results = c.Query<int, LeadRegion, LeadRegion>(
					LEADREGION_SEARCH,
					(count, lr) =>
					{
						pr.ResultCount = count;
						return lr;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key");

				pr.Data = new List<LeadRegion>(results);

				return pr;
			}
		}
		#endregion

		#region Project Survey
		public Dto.PagedResultset<ProjectSurvey> ProjectSurveyGet(Dto.ProjectSurveyRequest psr)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_startRow = psr.StartRow,
					p_rowCount = psr.RowCount,
					p_sortBy = psr.SortBy,
					p_sortDirection = psr.SortDirection,
					p_projectId = psr.ProjectKey,
					p_keywords = string.IsNullOrWhiteSpace(psr.Keywords) ? null : psr.Keywords
				};

				var pr = new Dto.PagedResultset<ProjectSurvey> { DataRequest = psr };
				pr.Data = c.Query<int, ProjectSurvey, BioDiversity, SurveyType, SurveyTemplate, ProjectSurvey>(
					SURVEY_SEARCH,
					(count, ps, s, st, t) =>
					{
						pr.ResultCount = count;
						ps.TargetSpecies = s;
						ps.SurveyType = st;
						ps.Template = t;
						return ps;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key").ToList();

				return pr;
			}
		}

		public ProjectSurvey ProjectSurveyGet(int surveyKey)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_surveyId = surveyKey
				};

				var survey = c.Query<ProjectSurvey, BioDiversity, SurveyType, SurveyTemplate, ProjectSurvey>(
					SURVEY_GET,
					(ps, s, st, t) =>
					{
						ps.TargetSpecies = s ?? new BioDiversity();
						ps.SurveyType = st ?? new SurveyType();
						ps.Template = t ?? new SurveyTemplate();
						return ps;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key").SingleOrDefault();

				return survey ?? new ProjectSurvey();
			}
		}

		public int ProjectSurveySave(Models.ProjectSurvey ps)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_surveyId = ps.Key,
					p_projectId = ps.ProjectKey,
					p_targetSpeciesId = ps.TargetSpecies.Key ==  0 ? null : (int?)ps.TargetSpecies.Key,
					p_surveyTypeId = ps.SurveyType.Key == 0 ? null : (int?)ps.SurveyType.Key,
					p_surveyTemplateId = ps.Template.Key == 0 ? null : (int?)ps.Template.Key,
					p_description = ps.Description,
					p_method = ps.Method,
					p_results = ps.Results,
					p_aircraftType = ps.AircraftType,
					p_aircraftCallsign = ps.AircraftCallsign,
					p_pilot = ps.Pilot,
					p_leadSurveyor = ps.LeadSurveyor,
					p_surveyCrew = ps.SurveyCrew,
					p_observerExpertise = ps.ObserverExpertise,
					p_aircraftCrewResults = ps.AircraftCrewResults,
					p_cloudCover = ps.CloudCover,
					p_lightConditions = ps.LightConditions,
					p_snowCover = ps.SnowCover,
					p_temperature = ps.Temperature,
					p_precipitation = ps.Precipitation,
					p_windSpeed = ps.WindSpeed,
					p_windDirection = ps.WindDirection,
					p_weatherComments = ps.WeatherComments
				};

				return c.Query<int>(SURVEY_SAVE, param, commandType: CommandType.StoredProcedure).Single();
			}
		}
		#endregion

		#region Project Survey Type
		public Dto.PagedResultset<Models.SurveyType> SurveyTypeSearch(Dto.SurveyTypeRequest str)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = str.StartRow,
					p_to = str.RowCount,
					p_sortBy = str.SortBy,
					p_sortDirection = str.SortDirection,
				};

				var pr = new Dto.PagedResultset<SurveyType> { DataRequest = str };

				pr.Data = c.Query<int, SurveyType, SurveyType>(
					SURVEYTYPE_SEARCH,
					(count, ps) =>
					{
						pr.ResultCount = count;
						return ps;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key").ToList();

				return pr;
			}
		}
		#endregion

		#region Project Collar
		public Dto.PagedResultset<Collar> ProjectCollarGet(Dto.ProjectCollarRequest psr)
		{
			var pr = new Dto.PagedResultset<Collar>
			{
				DataRequest = psr,
				ResultCount = 0,
				Data = new List<Collar>()
			};

			return pr;
		}
		
		#endregion

		#region Templates
		public Dto.PagedResultset<Models.SurveyTemplate> SurveyTemplateSearch(Dto.SurveyTemplateRequest str)
		{
			using (var c = NewWmisConnection)
			{
				var param = new
				{
					p_from = str.StartRow,
					p_to = str.RowCount,
					p_sortBy = str.SortBy,
					p_sortDirection = str.SortDirection,
				};

				var pr = new Dto.PagedResultset<SurveyTemplate> { DataRequest = str };

				pr.Data = c.Query<int, SurveyTemplate, SurveyTemplate>(
					SURVEYTEMPLATE_SEARCH,
					(count, ps) =>
					{
						pr.ResultCount = count;
						return ps;
					},
					param,
					commandType: CommandType.StoredProcedure,
					splitOn: "Key").ToList();

				return pr;
			}
		}
		#endregion

        #region Collars
        public int CollarCreate(string name)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_name = name
                };
                return c.Query<int>(COLLAR_CREATE, param, commandType: CommandType.StoredProcedure).Single();
            }
        }

        public Dto.PagedResultset<Collar> CollarGet(Dto.CollarSearchRequest sr)
        {
            var pagedResultset = new Dto.PagedResultset<Collar>
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
                    p_keywords = string.IsNullOrWhiteSpace(sr.Keywords) ? null : sr.Keywords.Trim(),
                    p_regionKey = sr.regionKey
                };

                using (var q = c.QueryMultiple(COLLAR_SEARCH, param, commandType: CommandType.StoredProcedure))
                {
                    pagedResultset.Data = q.Read<int, Collar, SimpleProject, CollarType, CollarRegion, CollarStatus, dynamic, Collar>(
                    (tc, collar, project, type, region, status, dyn) =>
                    {
                        pagedResultset.ResultCount = tc;
                        collar.Project = project ?? new SimpleProject();
                        collar.CollarType = type ?? new CollarType();
                        collar.CollarRegion = region ?? new CollarRegion();
                        collar.CollarStatus = status ?? new CollarStatus();
                        collar.CollarMalfunction = dyn.CollarMalfunctionKey == null ? new CollarMalfunction() : new CollarMalfunction { Key = dyn.CollarMalfunctionKey, Name = dyn.CollarMalfunctionName };
                        collar.CollarState = dyn.CollarStateKey == null ? new CollarState() : new CollarState { Key = dyn.CollarStateKey, Name = dyn.CollarStateName };
                        return collar;
                    },
                        "Key").ToList();

                }
            }

            return pagedResultset;
        }

        public Collar CollarGet(int collarKey)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_collarKey = collarKey
                };
                return c.Query<Collar, SimpleProject, CollarType, CollarRegion, CollarStatus, dynamic, Collar>(COLLAR_GET,
                    (collar, project, type, region, status, dyn) =>
                        {
                            collar.Project = project ?? new SimpleProject();
                            collar.CollarType = type ?? new CollarType();
                            collar.CollarRegion = region ?? new CollarRegion();
                            collar.CollarStatus = status ?? new CollarStatus();
                            collar.CollarMalfunction = dyn.CollarMalfunctionKey == null ? new CollarMalfunction() : new CollarMalfunction { Key = dyn.CollarMalfunctionKey, Name = dyn.CollarMalfunctionName };
                            collar.CollarState = dyn.CollarStateKey == null ? new CollarState() : new CollarState { Key = dyn.CollarStateKey, Name = dyn.CollarStateName };
                            return collar;
                        },
                        param,
                        commandType: CommandType.StoredProcedure,
                        splitOn: "Key").Single();
            }
        }

        public void CollarUpdate(Models.Collar collar)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_CollarId = collar.Key,
                    p_Name = collar.Name,
                    p_SubscriptionId = collar.SubscriptionId,
                    p_VhfFrequency = collar.VhfFrequency,
                    p_JobNumber = collar.JobNumber,
                    p_Model = collar.Model,
                    p_InactiveDate = collar.InactiveDate,
                    p_Size = collar.Size,
                    p_BeltingColour = collar.BeltingColour,
                    p_FirmwareVersion = collar.FirmwareVersion,
                    p_Comments = collar.Comments,
                    p_DropOffDate = collar.DropOffDate,
                    p_EstimatedDropOff = collar.EstimatedDropOff,
                    p_EstimatedGpsFailure = collar.EstimatedGpsFailure,
                    p_EstimatedGpsBatteryEnd = collar.EstimatedGpsBatteryEnd,
                    p_EstimatedVhfFailure = collar.EstimatedVhfFailure,
                    p_EstimatedVhfBatteryEnd = collar.EstimatedVhfBatteryEnd,
                    p_CollarTypeId = collar.CollarType.Key == 0 ? null : (int?)collar.CollarType.Key,
                    p_CollarRegionId = collar.CollarRegion.Key == 0 ? null : (int?)collar.CollarRegion.Key,
                    p_CollarStatusId = collar.CollarStatus.Key == 0 ? null : (int?)collar.CollarStatus.Key,
                    p_CollarMalfunctionId = collar.CollarMalfunction.Key == 0 ? null : (int?)collar.CollarMalfunction.Key,
                    p_CollarStateId = collar.CollarState.Key == 0 ? null : (int?)collar.CollarState.Key,
                    p_ProjectId = collar.Project.Key == 0 ? null : (int?)collar.Project.Key,
                };
                c.Execute(COLLAR_UPDATE, param, commandType: CommandType.StoredProcedure);
            }
        }

        public PagedResultset<CollarType> CollarTypeGet(CollarTypeRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                };

                var pagedResults = new PagedResultset<CollarType>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarType>()
                };

                var results = c.Query<dynamic, CollarType, CollarType>(COLLARTYPE_GET,
                    (d, collar) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return collar;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }
 
        public PagedResultset<CollarRegion> CollarRegionGet(CollarRegionRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                };

                var pagedResults = new PagedResultset<CollarRegion>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarRegion>()
                };

                var results = c.Query<dynamic, CollarRegion, CollarRegion>(COLLARREGION_GET,
                    (d, collar) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return collar;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }
        
        public PagedResultset<CollarStatus> CollarStatusGet(CollarStatusRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                };

                var pagedResults = new PagedResultset<CollarStatus>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarStatus>()
                };

                var results = c.Query<dynamic, CollarStatus, CollarStatus>(COLLARSTATUS_GET,
                    (d, collar) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return collar;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        public PagedResultset<CollarState> CollarStateGet(CollarStateRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                };

                var pagedResults = new PagedResultset<CollarState>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarState>()
                };

                var results = c.Query<dynamic, CollarState, CollarState>(COLLARSTATE_GET,
                    (d, collar) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return collar;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        public PagedResultset<CollarMalfunction> CollarMalfunctionGet(CollarMalfunctionRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_from = request.StartRow,
                    p_to = request.StartRow + request.RowCount - 1,
                    p_sortBy = request.SortBy,
                    p_sortDirection = request.SortDirection,
                };

                var pagedResults = new PagedResultset<CollarMalfunction>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarMalfunction>()
                };

                var results = c.Query<dynamic, CollarMalfunction, CollarMalfunction>(COLLARMALFUNCTION_GET,
                    (d, collar) =>
                    {
                        pagedResults.ResultCount = d.TotalRowCount;
                        return collar;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        public PagedResultset<CollarHistory> CollarHistorySearch(CollarHistoryRequest request)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_startRow = request.StartRow,
                    p_rowCount = request.StartRow + request.RowCount - 1,
                    p_collarKey = request.CollarKey
                };

                var pagedResults = new PagedResultset<CollarHistory>
                {
                    DataRequest = request,
                    ResultCount = 0,
                    Data = new List<CollarHistory>()
                };

                var results = c.Query<dynamic, CollarHistory, CollarHistory>(COLLARHISTORY_SEARCH,
                    (d, collarHistory) =>
                    {
                        pagedResults.ResultCount = d.ResultCount;
                        return collarHistory;
                    },
                    param,
                    commandType: CommandType.StoredProcedure,
                    splitOn: "Key");

                pagedResults.Data = results.ToList();
                return pagedResults;
            }
        }

        public void CollarHistorySave(Models.CollarHistory collarHistory)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_CollarHistoryId = collarHistory.Key,
                    p_Comment = collarHistory.Comment,
                };
                c.Execute(COLLARHISTORY_SAVE, param, commandType: CommandType.StoredProcedure);
            }
        }
        #endregion

        #region Argos Passes
        public void ArgosPassUpdate(int collarName, IEnumerable<ArgosPassForTvp> passes)
        {
            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_argosPasses = passes.AsTableValuedParameter("dbo.ArgosPassTableType"),
                    p_collarName = collarName,
                };
                c.Query<int>(ARGOSPASS_UPDATE, param, commandType: CommandType.StoredProcedure);
            }
        }

        public Dto.PagedResultset<ArgosPass> ArgosPassGet(Dto.ArgosPassSearchRequest apsr)
        {
            var pagedResultset = new Dto.PagedResultset<ArgosPass>
            {
                DataRequest = apsr,
                ResultCount = 0
            };

            using (var c = NewWmisConnection)
            {
                var param = new
                {
                    p_startRow = apsr.StartRow,
                    p_rowCount = apsr.RowCount,
                    p_collarKey = apsr.CollarId
                };

                using (var q = c.QueryMultiple(ARGOSPASS_SEARCH, param, commandType: CommandType.StoredProcedure))
                {
                    pagedResultset.Data = q.Read<int, ArgosPass, ArgosPass>(
                    (tc, ap) =>
                    {
                        pagedResultset.ResultCount = tc;
                        return ap;
                    },
                        "Key").ToList();

                }
            }

            return pagedResultset;
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