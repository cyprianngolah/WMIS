CREATE PROCEDURE [dbo].[BioDiversity_GetAll] AS
	SELECT 
		s.SpeciesId as [Key],
		s.Name,
		s.CommonName,
		s.SubSpeciesName,
		s.EcoType,
		s.NSGlobalId,
		s.NSNWTId,
		s.ELCODE,
		s.NonNTSpecies,
		s.CanadaKnownSubSpeciesCount,
		s.CanadaKnownSubSpeciesDescription,
		s.NWTKnownSubSpeciesCount,
		s.NWTKnownSubSpeciesDescription,
		s.AgeOfMaturity,
		s.AgeOfMaturityDescription,
		s.ReproductionFrequencyPerYear,
		s.ReproductionFrequencyPerYearDescription,
		s.Longevity,
		s.LongevityDescription,
		s.VegetationReproductionDescription,
		s.HostFishDescription,
		s.OtherReproductionDescription,
		s.EcozoneDescription,
		s.EcoregionDescription,
		s.ProtectedAreaDescription,
		s.RangeExtentScore,
		s.RangeExtentDescription,
		s.DistributionPercentage,
		s.AreaOfOccupancyScore,
		s.AreaOfOccupancyDescription,
		s.HistoricalDistributionDescription,
		s.MarineDistributionDescription,
		s.WinterDistributionDescription,
		s.HabitatDescription,
		s.EnvironmentalSpecificityScore,
		s.EnvironmentalSpecificityDescription,
		s.PopulationSizeScore,
		s.PopulationSizeDescription,
		s.NumberOfOccurencesScore,
		s.NumberOfOccurencesDescription,
		s.DensityDescription,
		s.ThreatsScore,
		s.ThreatsDescription,
		s.IntrinsicVulnerabilityScore,
		s.IntrinsicVulnerabilityDescription,
		s.ShortTermTrendsScore,
		s.ShortTermTrendsDescription,
		s.LongTermTrendsScore,
		s.LongTermTrendsDescription,
		s.StatusRankDescription,
		s.SRank,
		s.DecisionProcessDescription,
		s.EconomicStatusDescription,
		s.COSEWICStatusDescription,
		s.NRank,
		s.FederalSpeciesAtRiskStatusDescription,
		s.NWTSARCAssessmentDescription,
		s.NWTSpeciesAtRiskStatusDescription,
		s.IUCNStatus,
		s.GRank,
		s.IUCNDescription,
		s.LastUpdated,
		s.SARAStatusId as [Key],
		saraStatus.Name,
		s.NWTStatusRankId as [Key],
		nwtStatusRank.Name,
		s.StatusRankId as [Key],
		s.StatusRankDescription,
		statusRank.Name,
		s.COSEWICStatusId AS [Key],
		s.COSEWICStatusDescription,
		cosewic.Name,
		s.NwtSarcAssessmentId AS [Key],
		nwtSarcAssessment.Name,
		1 as [Key],		-- Done to ensure the dynamic always maps back to an actual object and not null
		s.KingdomTaxonomyId as [KingdomKey],
		kingdom.Name as [KingdomName], 
		s.PhylumTaxonomyId as [PhylumKey],
		phylum.Name as [PhylumName],
		s.SubPhylumTaxonomyId as [SubPhylumKey],
		subPhylum.Name as [SubPhylumName],
		s.ClassTaxonomyId as [ClassKey],
		[class].Name as [ClassName],
		s.SubClassTaxonomyId as [SubClassKey],
		[subClass].Name as [SubClassName],
		s.OrderTaxonomyId as [OrderKey],
		[order].Name as [OrderName],
		s.SubOrderTaxonomyId as [SubOrderKey],
		[subOrder].Name as [SubOrderName],
		s.InfraOrderTaxonomyId as [InfraOrderKey],
		[infraOrder].Name as [InfraOrderName],
		s.SuperFamilyTaxonomyId as [SuperFamilyKey],
		[superFamily].Name as [SuperFamilyName],
		s.FamilyTaxonomyId as [FamilyKey],
		[family].Name as [FamilyName],
		s.SubFamilyTaxonomyId as [SubFamilyKey],
		[subFamily].Name as [SubFamilyName],
		s.GroupTaxonomyId as [GroupKey],
		[group].Name as [GroupName]
	FROM
		dbo.Species s
			LEFT OUTER JOIN dbo.StatusRanks statusRank on s.StatusRankId = statusRank.StatusRankId
			LEFT OUTER JOIN dbo.COSEWICStatus cosewic on s.COSEWICStatusId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.COSEWICStatus saraStatus on s.SARAStatusId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.COSEWICStatus nwtStatusRank on s.NWTStatusRankId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.NwtSarcAssessments nwtSarcAssessment on s.NwtSarcAssessmentId = nwtSarcAssessment.NwtSarcAssessmentId
			LEFT OUTER JOIN dbo.Taxonomy kingdom on s.KingdomTaxonomyId = kingdom.TaxonomyId AND kingdom.TaxonomyGroupId = 1
			LEFT OUTER JOIN dbo.Taxonomy phylum on s.PhylumTaxonomyId = phylum.TaxonomyId AND phylum.TaxonomyGroupId = 2
			LEFT OUTER JOIN dbo.Taxonomy subphylum on s.SubPhylumTaxonomyId = subphylum.TaxonomyId AND subphylum.TaxonomyGroupId = 3
			LEFT OUTER JOIN dbo.Taxonomy class on s.ClassTaxonomyId = class.TaxonomyId AND class.TaxonomyGroupId = 4
			LEFT OUTER JOIN dbo.Taxonomy subClass on s.SubClassTaxonomyId = subClass.TaxonomyId AND subClass.TaxonomyGroupId = 5
			LEFT OUTER JOIN dbo.Taxonomy [order] on s.OrderTaxonomyId = [order].TaxonomyId AND [order].TaxonomyGroupId = 6
			LEFT OUTER JOIN dbo.Taxonomy subOrder on s.SubOrderTaxonomyId = subOrder.TaxonomyId AND subOrder.TaxonomyGroupId = 7
			LEFT OUTER JOIN dbo.Taxonomy infraOrder on s.InfraOrderTaxonomyId = infraOrder.TaxonomyId AND infraOrder.TaxonomyGroupId = 8
			LEFT OUTER JOIN dbo.Taxonomy superFamily on s.SuperFamilyTaxonomyId = superFamily.TaxonomyId AND superFamily.TaxonomyGroupId = 9
			LEFT OUTER JOIN dbo.Taxonomy family on s.FamilyTaxonomyId = family.TaxonomyId AND family.TaxonomyGroupId = 10	
			LEFT OUTER JOIN dbo.Taxonomy subFamily on s.SubFamilyTaxonomyId = subFamily.TaxonomyId AND subFamily.TaxonomyGroupId = 11
			LEFT OUTER JOIN dbo.Taxonomy [group] on s.GroupTaxonomyId = [group].TaxonomyId AND [group].TaxonomyGroupId = 12

	SELECT
		se.EcozoneId as [Key],
		se.SpeciesId,
		e.Name
	FROM
		dbo.SpeciesEcozones se 
			INNER JOIN dbo.Ecozones e on se.EcozoneId = e.EcozoneId
	
	SELECT
		se.EcoregionId as [Key],
		se.SpeciesId,
		e.Name
	FROM
		dbo.SpeciesEcoregions se 
			INNER JOIN dbo.Ecoregions e on se.EcoregionId = e.EcoregionId 
	
	SELECT
		spa.ProtectedAreaId as [Key],
		spa.SpeciesId,
		e.Name
	FROM
		dbo.SpeciesProtectedAreas spa 
			INNER JOIN dbo.ProtectedAreas e on spa.ProtectedAreaId = e.ProtectedAreaId
	
	SELECT
		sp.SpeciesPopulationId as [Key],
		sp.SpeciesId,
		sp.Name
	FROM
		dbo.SpeciesPopulations sp
	
	SELECT	
		rc.ReferenceCategoryId as [Key],
		sr.SpeciesId,
		r.ReferenceId as [Key],
		r.Code,
		r.Author,
		r.Year, 
		r.Title, 
		r.EditionPublicationOrganization, 
		r.VolumePage, 
		r.Publisher, 
		r.City, 
		r.Location
	FROM
		dbo.[References] r
			INNER JOIN dbo.SpeciesReferences sr	ON sr.ReferenceId = r.ReferenceId
			INNER JOIN dbo.ReferenceCategories rc ON rc.ReferenceCategoryId = sr.ReferenceCategoryId
		
RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_GetAll] TO [WMISUser]
GO