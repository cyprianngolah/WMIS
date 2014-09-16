﻿CREATE PROCEDURE [dbo].[BioDiversity_Get]
	@p_bioDiversityKey INT
AS
	/*
	EXEC [dbo].[BioDiversity_Get] 6
	*/

	SELECT TOP 1
		s.SpeciesId as [Key],
		s.Name,
		s.CommonName,
		s.SubSpeciesName,
		s.EcoType,
		s.[Population],
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
		s.SARAStatus,
		s.FederalSpeciesAtRiskStatusDescription,
		s.NWTSARCAssessmentDescription,
		s.NWTStatusRank,
		s.NWTSpeciesAtRiskStatusDescription,
		s.CanadianConservationSignificanceDescription,
		s.IUCNStatus,
		s.GRank,
		s.IUCNDescription,
		s.StatusRankId as [Key],
		s.StatusRankDescription,
		statusRank.Name,
		s.COSEWICStatusId AS [Key],
		s.COSEWICStatusDescription,
		cosewic.Name,
		s.KingdomTaxonomyId as [Key],
		kingdom.Name, 
		s.PhylumTaxonomyId as [Key],
		phylum.Name,
		1 as [Key],		-- Done to ensure the dynamic always maps back to an actual object and not null
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
			LEFT OUTER JOIN dbo.StatusRanks statusRank on s.StatusRankId = statusRank.statusRankId
			LEFT OUTER JOIN dbo.COSEWICStatus cosewic on s.COSEWICStatusId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.Taxonomy kingdom on s.KingdomTaxonomyId = kingdom.TaxonomyId AND kingdom.taxonomyGroupId = 1
			LEFT OUTER JOIN dbo.Taxonomy phylum on s.PhylumTaxonomyId = phylum.TaxonomyId AND phylum.taxonomyGroupId = 2
			LEFT OUTER JOIN dbo.Taxonomy subphylum on s.SubPhylumTaxonomyId = subphylum.TaxonomyId AND subphylum.taxonomyGroupId = 3
			LEFT OUTER JOIN dbo.Taxonomy class on s.ClassTaxonomyId = class.TaxonomyId AND class.taxonomyGroupId = 4
			LEFT OUTER JOIN dbo.Taxonomy subClass on s.SubClassTaxonomyId = subClass.TaxonomyId AND subClass.taxonomyGroupId = 5
			LEFT OUTER JOIN dbo.Taxonomy [order] on s.OrderTaxonomyId = [order].TaxonomyId AND [order].taxonomyGroupId = 6
			LEFT OUTER JOIN dbo.Taxonomy subOrder on s.SubOrderTaxonomyId = subOrder.TaxonomyId AND subOrder.taxonomyGroupId = 7
			LEFT OUTER JOIN dbo.Taxonomy infraOrder on s.InfraOrderTaxonomyId = infraOrder.TaxonomyId AND infraOrder.taxonomyGroupId = 8
			LEFT OUTER JOIN dbo.Taxonomy superFamily on s.SuperFamilyTaxonomyId = superFamily.TaxonomyId AND superFamily.taxonomyGroupId = 9
			LEFT OUTER JOIN dbo.Taxonomy family on s.FamilyTaxonomyId = family.TaxonomyId AND family.taxonomyGroupId = 10	
			LEFT OUTER JOIN dbo.Taxonomy subFamily on s.SubFamilyTaxonomyId = subFamily.TaxonomyId AND subFamily.taxonomyGroupId = 11
			LEFT OUTER JOIN dbo.Taxonomy [group] on s.GroupTaxonomyId = [group].TaxonomyId AND [group].taxonomyGroupId = 12
	WHERE
		s.SpeciesId = @p_bioDiversityKey

	SELECT
		se.EcozoneId as [Key],
		e.Name
	FROM
		dbo.SpeciesEcozones se 
			INNER JOIN dbo.Ecozones e on se.EcozoneId = e.EcozoneId
	WHERE
		se.SpeciesId = @p_bioDiversityKey

	SELECT
		se.EcoregionId  as [Key],
		e.Name
	FROM
		dbo.SpeciesEcoregions se 
			INNER JOIN dbo.Ecoregions e on se.EcoregionId = e.EcoregionId 
	WHERE
		se.SpeciesId = @p_bioDiversityKey

	SELECT
		spa.ProtectedAreaId as [Key],
		e.Name
	FROM
		dbo.SpeciesProtectedAreas spa 
			INNER JOIN dbo.ProtectedAreas e on spa.ProtectedAreaId = e.ProtectedAreaId
	WHERE
		spa.SpeciesId = @p_bioDiversityKey

	
	SELECT	
		rc.ReferenceCategoryId as CategoryKey,
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
	WHERE
		sr.SpeciesId = @p_bioDiversityKey 
		
RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_Get] TO [WMISUser]
GO