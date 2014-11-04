
CREATE PROCEDURE [dbo].[BioDiversity_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_groupKey INT = NULL,
	@p_orderKey INT = NULL,
	@p_familyKey INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	/*
	EXEC [dbo].[BioDiversity_Search]
	*/

	CREATE TABLE #SpeciesTemp (SpeciesId INT);

	INSERT INTO #SpeciesTemp (SpeciesId)
	SELECT s.SpeciesId as [Key]
	FROM 
		dbo.Species s
			LEFT OUTER JOIN dbo.Taxonomy [order] on s.OrderTaxonomyId = [order].TaxonomyId AND [order].TaxonomyGroupId = 6
			LEFT OUTER JOIN dbo.Taxonomy family on s.FamilyTaxonomyId = family.TaxonomyId AND family.TaxonomyGroupId = 10	
			LEFT OUTER JOIN dbo.Taxonomy [group] on s.GroupTaxonomyId = [group].TaxonomyId AND [group].TaxonomyGroupId = 12	
	WHERE
		(@p_groupKey IS NULL OR s.GroupTaxonomyId = @p_groupKey) 
		AND (@p_orderKey IS NULL OR s.OrderTaxonomyId = @p_orderKey) 
		AND (@p_familyKey IS NULL OR s.FamilyTaxonomyId = @p_familyKey) 
		AND (
			@p_keywords IS NULL 
			OR s.Name LIKE '%' + @p_keywords + '%' 
			OR s.CommonName LIKE '%' + @p_keywords + '%'  
			OR s.SubSpeciesName LIKE '%' + @p_keywords + '%'
			OR s.ELCODE LIKE '%' + @p_keywords + '%'
		) 
	ORDER BY
		CASE WHEN @p_sortBy = 'group.name' AND @p_sortDirection = '0'
			THEN [group].Name END ASC,
		CASE WHEN @p_sortBy = 'group.name' AND @p_sortDirection = '1'
			THEN [group].Name END DESC,
		CASE WHEN @p_sortBy = 'order.name' AND @p_sortDirection = '0'
			THEN [order].Name END ASC,
		CASE WHEN @p_sortBy = 'order.name' AND @p_sortDirection = '1'
			THEN [order].Name END DESC,
		CASE WHEN @p_sortBy = 'family.name' AND @p_sortDirection = '0'
			THEN [family].Name END ASC,
		CASE WHEN @p_sortBy = 'family.name' AND @p_sortDirection = '1'
			THEN [family].Name END DESC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '0'
			THEN s.CommonName END ASC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '1'
			THEN s.CommonName END DESC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '0'
			THEN s.Name END ASC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '1'
			THEN s.Name END DESC,
		CASE WHEN @p_sortBy = 'subSpeciesName' AND @p_sortDirection = '0'
			THEN s.SubSpeciesName END ASC,
		CASE WHEN @p_sortBy = 'subSpeciesName' AND @p_sortDirection = '1'
			THEN s.SubSpeciesName END DESC,
		CASE WHEN @p_sortBy = 'ecoType' AND @p_sortDirection = '0'
			THEN s.EcoType END ASC,
		CASE WHEN @p_sortBy = 'ecoType' AND @p_sortDirection = '1'
			THEN s.EcoType END DESC,
		CASE WHEN @p_sortBy = 'lastUpdated' AND @p_sortDirection = '0'
			THEN s.LastUpdated END ASC,
		CASE WHEN @p_sortBy = 'lastUpdated' AND @p_sortDirection = '1'
			THEN s.LastUpdated END DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

	SELECT 
		COUNT(*) OVER() AS ResultCount,
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
		statusRank.Name,
		s.COSEWICStatusId AS [Key],
		cosewic.Name,
		1 as [Key],		-- Done to ensure the dynamic always maps back to an actual object and not null
		s.KingdomTaxonomyId as [KingdomTaxonomyKey],
		kingdom.Name as [KingdomTaxonomyName], 
		s.PhylumTaxonomyId as [PhylumTaxonomyKey],
		phylum.Name as [PhylumTaxonomyName],
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
		#SpeciesTemp st
			LEFT OUTER JOIN dbo.Species s on st.SpeciesId = s.SpeciesId
			LEFT OUTER JOIN dbo.StatusRanks statusRank on s.StatusRankId = statusRank.StatusRankId
			LEFT OUTER JOIN dbo.COSEWICStatus cosewic on s.COSEWICStatusId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.COSEWICStatus saraStatus on s.SARAStatusId = cosewic.COSEWICStatusId
			LEFT OUTER JOIN dbo.COSEWICStatus nwtStatusRank on s.NWTStatusRankId = cosewic.COSEWICStatusId
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
	ORDER BY
		CASE WHEN @p_sortBy = 'group.name' AND @p_sortDirection = '0'
			THEN [group].Name END ASC,
		CASE WHEN @p_sortBy = 'group.name' AND @p_sortDirection = '1'
			THEN [group].Name END DESC,
		CASE WHEN @p_sortBy = 'order.name' AND @p_sortDirection = '0'
			THEN [order].Name END ASC,
		CASE WHEN @p_sortBy = 'order.name' AND @p_sortDirection = '1'
			THEN [order].Name END DESC,
		CASE WHEN @p_sortBy = 'family.name' AND @p_sortDirection = '0'
			THEN [family].Name END ASC,
		CASE WHEN @p_sortBy = 'family.name' AND @p_sortDirection = '1'
			THEN [family].Name END DESC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '0'
			THEN s.CommonName END ASC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '1'
			THEN s.CommonName END DESC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '0'
			THEN s.Name END ASC,
		CASE WHEN @p_sortBy = 'name' AND @p_sortDirection = '1'
			THEN s.Name END DESC,
		CASE WHEN @p_sortBy = 'subSpeciesName' AND @p_sortDirection = '0'
			THEN s.SubSpeciesName END ASC,
		CASE WHEN @p_sortBy = 'subSpeciesName' AND @p_sortDirection = '1'
			THEN s.SubSpeciesName END DESC,
		CASE WHEN @p_sortBy = 'ecoType' AND @p_sortDirection = '0'
			THEN s.EcoType END ASC,
		CASE WHEN @p_sortBy = 'ecoType' AND @p_sortDirection = '1'
			THEN s.EcoType END DESC,
		CASE WHEN @p_sortBy = 'lastUpdated' AND @p_sortDirection = '0'
			THEN s.LastUpdated END ASC,
		CASE WHEN @p_sortBy = 'lastUpdated' AND @p_sortDirection = '1'
			THEN s.LastUpdated END DESC

	SELECT
		sp.SpeciesId as [Key],
		sp.Name
	FROM
		#SpeciesTemp st
			LEFT OUTER JOIN dbo.SpeciesPopulations sp on st.SpeciesId = sp.SpeciesId
	ORDER BY
		sp.SpeciesId

	DROP TABLE #SpeciesTemp;

RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_Search] TO [WMISUser]
GO