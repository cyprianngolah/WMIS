CREATE PROCEDURE [dbo].[BioDiversity_Update]
	@p_SpeciesId INT,
	@p_Name NVARCHAR(50),
	@p_CommonName NVARCHAR(50) = NULL,
	@p_SubSpeciesName NVARCHAR(50) = NULL,
	@p_EcoType NVARCHAR(50) = NULL,
	@p_NSGlobalId NVARCHAR(50) = NULL,
	@p_NSNWTId NVARCHAR(50) = NULL,
	@p_ELCODE NVARCHAR(50) = NULL,
	@p_KingdomTaxonomyId INT = NULL,
	@p_PhylumTaxonomyId INT = NULL,
	@p_SubPhylumTaxonomyId INT = NULL,
	@p_ClassTaxonomyId INT = NULL,
	@p_SubClassTaxonomyId INT = NULL,
	@p_OrderTaxonomyId INT = NULL,
	@p_SubOrderTaxonomyId INT = NULL,
	@p_InfraOrderTaxonomyId INT = NULL,
	@p_SuperFamilyTaxonomyId INT = NULL,
	@p_FamilyTaxonomyId INT = NULL,
	@p_SubFamilyTaxonomyId INT = NULL,
	@p_GroupTaxonomyId INT = NULL,
	@p_NonNTSpecies BIT = NULL,
	@p_CanadaKnownSubSpeciesCount INT = NULL,
	@p_CanadaKnownSubSpeciesDescription NVARCHAR(MAX) = NULL,
	@p_NWTKnownSubSpeciesCount INT = NULL,
	@p_NWTKnownSubSpeciesDescription NVARCHAR(MAX) = NULL,
	@p_AgeOfMaturity INT = NULL,
	@p_AgeOfMaturityDescription NVARCHAR(MAX) = NULL,
	@p_ReproductionFrequencyPerYear INT = NULL,
	@p_ReproductionFrequencyPerYearDescription NVARCHAR(MAX) = NULL,
	@p_Longevity INT = NULL,
	@p_LongevityDescription NVARCHAR(MAX) = NULL,
	@p_VegetationReproductionDescription NVARCHAR(MAX) = NULL,
	@p_HostFishDescription NVARCHAR(MAX) = NULL,
	@p_OtherReproductionDescription NVARCHAR(MAX) = NULL,
	@p_EcozoneDescription NVARCHAR(MAX) = NULL,
	@p_EcoregionDescription NVARCHAR(MAX) = NULL,
	@p_ProtectedAreaDescription NVARCHAR(MAX) = NULL,
	@p_RangeExtentScore NVARCHAR(5) = NULL,
	@p_RangeExtentDescription NVARCHAR(MAX) = NULL,
	@p_DistributionPercentage NVARCHAR(50) = NULL,
	@p_AreaOfOccupancyScore NVARCHAR(5) = NULL,
	@p_AreaOfOccupancyDescription NVARCHAR(MAX) = NULL,
	@p_HistoricalDistributionDescription NVARCHAR(MAX) = NULL,
	@p_MarineDistributionDescription NVARCHAR(MAX) = NULL,
	@p_WinterDistributionDescription NVARCHAR(MAX) = NULL,
	@p_HabitatDescription NVARCHAR(MAX) = NULL,
	@p_EnvironmentalSpecificityScore NVARCHAR(5) = NULL,
	@p_EnvironmentalSpecificityDescription NVARCHAR(MAX) = NULL,
	@p_PopulationSizeScore NVARCHAR(5) = NULL,
	@p_PopulationSizeDescription NVARCHAR(MAX) = NULL,
	@p_NumberOfOccurencesScore NVARCHAR(5) = NULL,
	@p_NumberOfOccurencesDescription NVARCHAR(MAX) = NULL,
	@p_DensityDescription NVARCHAR(MAX) = NULL,
	@p_ThreatsScore NVARCHAR(5) = NULL,
	@p_ThreatsDescription NVARCHAR(MAX) = NULL,
	@p_IntrinsicVulnerabilityScore NVARCHAR(5) = NULL,
	@p_IntrinsicVulnerabilityDescription NVARCHAR(MAX) = NULL,
	@p_ShortTermTrendsScore NVARCHAR(5) = NULL,
	@p_ShortTermTrendsDescription NVARCHAR(MAX) = NULL,
	@p_LongTermTrendsScore NVARCHAR(5) = NULL,
	@p_LongTermTrendsDescription NVARCHAR(MAX) = NULL,
	@p_StatusRankId INT = NULL,
	@p_StatusRankDescription NVARCHAR(MAX) = NULL,
	@p_SRank NVARCHAR(50) = NULL,
	@p_DecisionProcessDescription NVARCHAR(MAX) = NULL,
	@p_EconomicStatusDescription NVARCHAR(MAX) = NULL,
	@p_COSEWICStatusId INT = NULL,
	@p_COSEWICStatusDescription NVARCHAR(MAX) = NULL,
	@p_NRank NVARCHAR(50) = NULL,
	@p_SARAStatusId NVARCHAR(50) = NULL,
	@p_FederalSpeciesAtRiskStatusDescription NVARCHAR(MAX) = NULL,
	@p_NwtSarcAssessmentId Int = NULL,
	@p_NWTSARCAssessmentDescription NVARCHAR(MAX) = NULL,
	@p_NWTStatusRankId NVARCHAR(50) = NULL,
	@p_NWTSpeciesAtRiskStatusDescription NVARCHAR(MAX) = NULL,
	@p_IUCNStatus NVARCHAR(50) = NULL,
	@p_GRank NVARCHAR(50) = NULL,
	@p_IUCNDescription NVARCHAR(50) = NULL,
	@p_ecozones [IntTableType] READONLY,
	@p_ecoregions [IntTableType] READONLY,
	@p_protectedAreas [IntTableType] READONLY,
	@p_populations [NameTableType] READONLY,
	@p_references [TwoIntTableType] READONLY,
	@p_ChangeBy NVARCHAR(50)
AS
	
	-- Only Update LastUpdated timestamp if a value in the "Status" tab changed
	DECLARE @v_lastUpdated DATETIME = NULL;
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND (
			StatusRankId != @p_StatusRankId
			OR StatusRankDescription != @p_StatusRankDescription
			OR SRank != @p_SRank
			OR DecisionProcessDescription != @p_DecisionProcessDescription
			OR EconomicStatusDescription != @p_EconomicStatusDescription
			OR COSEWICStatusId != @p_COSEWICStatusId
			OR COSEWICStatusDescription != @p_COSEWICStatusDescription
			OR NRank != @p_NRank
			OR SARAStatusId != @p_SARAStatusId
			OR FederalSpeciesAtRiskStatusDescription != @p_FederalSpeciesAtRiskStatusDescription
			OR NwtSarcAssessmentId != @p_NwtSarcAssessmentId
			OR NWTSARCAssessmentDescription != @p_NWTSARCAssessmentDescription
			OR NWTStatusRankId != @p_NWTStatusRankId
			OR NWTSpeciesAtRiskStatusDescription != @p_NWTSpeciesAtRiskStatusDescription
			OR IUCNStatus != @p_IUCNStatus
			OR GRank != @p_GRank
			OR IUCNDescription != @p_IUCNDescription)
		)
	BEGIN
		SET @v_lastUpdated = GETUTCDATE()
	END

	--Status Rank
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND StatusRankId != @p_StatusRankId
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "Rank", (SELECT Name from StatusRanks where StatusRankId = @p_StatusRankId), @p_ChangeBy)
	END
	
	--Status Rank Description
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND StatusRankDescription != @p_StatusRankDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "Rank Description", @p_StatusRankDescription, @p_ChangeBy)
	END
		
	--S Rank
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND SRank != @p_SRank
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "S Rank", @p_SRank, @p_ChangeBy)
	END	

	--Decision Process
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND DecisionProcessDescription != @p_DecisionProcessDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "Decision Process", @p_DecisionProcessDescription, @p_ChangeBy)
	END

	--Economic Status Description
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND EconomicStatusDescription != @p_EconomicStatusDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "Economic Status Description", @p_EconomicStatusDescription, @p_ChangeBy)
	END
	
	--COSEWIC Status Id
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND COSEWICStatusId != @p_COSEWICStatusId
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "COSEWIC Status", (SELECT Name from COSEWICStatus where COSEWICStatusId = @p_COSEWICStatusId), @p_ChangeBy)
	END

	--COSEWIC Status Description
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND COSEWICStatusDescription != @p_COSEWICStatusDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "COSEWIC Status Description", @p_COSEWICStatusDescription, @p_ChangeBy)
	END

	--N Rank
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND NRank != @p_NRank
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "N Rank", @p_NRank, @p_ChangeBy)
	END	

	--SARA Status Id
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND SARAStatusId != @p_SARAStatusId
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "SARA Status", (SELECT Name from COSEWICStatus where COSEWICStatusId = @p_SARAStatusId), @p_ChangeBy)
	END
	
	--FederalSpeciesAtRiskStatusDescription
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND FederalSpeciesAtRiskStatusDescription != @p_FederalSpeciesAtRiskStatusDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "Federal Species At Risk Description", @p_FederalSpeciesAtRiskStatusDescription, @p_ChangeBy)
	END	

	--NwtSarcAssessmentId
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND NwtSarcAssessmentId != @p_NwtSarcAssessmentId
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "NWT SARC Assessment", (SELECT Name from NwtSarcAssessments where NwtSarcAssessmentId = @p_NwtSarcAssessmentId), @p_ChangeBy)
	END

	--NWTSARCAssessmentDescription
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND NWTSARCAssessmentDescription != @p_NWTSARCAssessmentDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "NWT SARC Assessment Description", @p_NWTSARCAssessmentDescription, @p_ChangeBy)
	END		
			
	--NWTStatusRankId
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND NWTStatusRankId != @p_NWTStatusRankId
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "NWT Status", (SELECT Name from COSEWICStatus where COSEWICStatusId = @p_NWTStatusRankId), @p_ChangeBy)
	END
	
	--NWTSpeciesAtRiskStatusDescription
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND NWTSpeciesAtRiskStatusDescription != @p_NWTSpeciesAtRiskStatusDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "NWT Species at Risk Status Description", @p_NWTSpeciesAtRiskStatusDescription, @p_ChangeBy)
	END	

	--IUCNStatus
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND IUCNStatus != @p_IUCNStatus
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "IUCN Status", @p_IUCNStatus, @p_ChangeBy)
	END	

	--GRank
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND GRank != @p_GRank
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "G Rank", @p_GRank, @p_ChangeBy)
	END	

	--IUCNDescription
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE
		SpeciesId = @p_SpeciesId
		AND IUCNDescription != @p_IUCNDescription
	)
	BEGIN
		INSERT INTO HistoryLogs (SpeciesId, Item, Value, ChangeBy) VALUES (@p_SpeciesId, "IUCN Status Description", @p_IUCNDescription, @p_ChangeBy)
	END	

	UPDATE
		dbo.Species
	SET
		Name = @p_Name,
		CommonName = @p_CommonName,
		SubSpeciesName = @p_SubSpeciesName,
		EcoType = @p_EcoType,
		NSGlobalId = @p_NSGlobalId,
		NSNWTId = @p_NSNWTId,
		ELCODE = @p_ELCODE,
		KingdomTaxonomyId = @p_KingdomTaxonomyId,
		PhylumTaxonomyId = @p_PhylumTaxonomyId,
		SubPhylumTaxonomyId = @p_SubPhylumTaxonomyId,
		ClassTaxonomyId = @p_ClassTaxonomyId,
		SubClassTaxonomyId = @p_SubClassTaxonomyId,
		OrderTaxonomyId = @p_OrderTaxonomyId,
		SubOrderTaxonomyId = @p_SubOrderTaxonomyId,
		InfraOrderTaxonomyId = @p_InfraOrderTaxonomyId,
		SuperFamilyTaxonomyId = @p_SuperFamilyTaxonomyId,
		FamilyTaxonomyId = @p_FamilyTaxonomyId,
		SubFamilyTaxonomyId = @p_SubFamilyTaxonomyId,
		GroupTaxonomyId = @p_GroupTaxonomyId,
		NonNTSpecies = @p_NonNTSpecies,
		CanadaKnownSubSpeciesCount = @p_CanadaKnownSubSpeciesCount,
		CanadaKnownSubSpeciesDescription = @p_CanadaKnownSubSpeciesDescription,
		NWTKnownSubSpeciesCount = @p_NWTKnownSubSpeciesCount,
		NWTKnownSubSpeciesDescription = @p_NWTKnownSubSpeciesDescription,
		AgeOfMaturity = @p_AgeOfMaturity,
		AgeOfMaturityDescription = @p_AgeOfMaturityDescription,
		ReproductionFrequencyPerYear = @p_ReproductionFrequencyPerYear,
		ReproductionFrequencyPerYearDescription = @p_ReproductionFrequencyPerYearDescription,
		Longevity = @p_Longevity,
		LongevityDescription = @p_LongevityDescription,
		VegetationReproductionDescription = @p_VegetationReproductionDescription,
		HostFishDescription = @p_HostFishDescription,
		OtherReproductionDescription = @p_OtherReproductionDescription,
		EcozoneDescription = @p_EcozoneDescription,
		EcoregionDescription = @p_EcoregionDescription,
		ProtectedAreaDescription = @p_ProtectedAreaDescription,
		RangeExtentScore = @p_RangeExtentScore,
		RangeExtentDescription = @p_RangeExtentDescription,
		DistributionPercentage = @p_DistributionPercentage,
		AreaOfOccupancyScore = @p_AreaOfOccupancyScore,
		AreaOfOccupancyDescription = @p_AreaOfOccupancyDescription,
		HistoricalDistributionDescription = @p_HistoricalDistributionDescription,
		MarineDistributionDescription = @p_MarineDistributionDescription,
		WinterDistributionDescription = @p_WinterDistributionDescription,
		HabitatDescription = @p_HabitatDescription,
		EnvironmentalSpecificityScore = @p_EnvironmentalSpecificityScore,
		EnvironmentalSpecificityDescription = @p_EnvironmentalSpecificityDescription,
		PopulationSizeScore = @p_PopulationSizeScore,
		PopulationSizeDescription = @p_PopulationSizeDescription,
		NumberOfOccurencesScore = @p_NumberOfOccurencesScore,
		NumberOfOccurencesDescription = @p_NumberOfOccurencesDescription,
		DensityDescription = @p_DensityDescription,
		ThreatsScore = @p_ThreatsScore,
		ThreatsDescription = @p_ThreatsDescription,
		IntrinsicVulnerabilityScore = @p_IntrinsicVulnerabilityScore,
		IntrinsicVulnerabilityDescription = @p_IntrinsicVulnerabilityDescription,
		ShortTermTrendsScore = @p_ShortTermTrendsScore,
		ShortTermTrendsDescription = @p_ShortTermTrendsDescription,
		LongTermTrendsScore = @p_LongTermTrendsScore,
		LongTermTrendsDescription = @p_LongTermTrendsDescription,
		StatusRankId = @p_StatusRankId,
		StatusRankDescription = @p_StatusRankDescription,
		SRank = @p_SRank,
		DecisionProcessDescription = @p_DecisionProcessDescription,
		EconomicStatusDescription = @p_EconomicStatusDescription,
		COSEWICStatusId = @p_COSEWICStatusId,
		COSEWICStatusDescription = @p_COSEWICStatusDescription,
		NRank = @p_NRank,
		SARAStatusId = @p_SARAStatusId,
		FederalSpeciesAtRiskStatusDescription = @p_FederalSpeciesAtRiskStatusDescription,
		NwtSarcAssessmentId = @p_NwtSarcAssessmentId,
		NWTSARCAssessmentDescription = @p_NWTSARCAssessmentDescription,
		NWTStatusRankId = @p_NWTStatusRankId,
		NWTSpeciesAtRiskStatusDescription = @p_NWTSpeciesAtRiskStatusDescription,
		IUCNStatus = @p_IUCNStatus,
		GRank = @p_GRank,
		IUCNDescription = @p_IUCNDescription,
		LastUpdated = ISNULL(@v_lastUpdated, LastUpdated)
	WHERE
		SpeciesId = @p_SpeciesId

	-- Ecozones
	MERGE SpeciesEcozones AS T
	USING @p_ecozones AS S
	ON (T.EcozoneId = S.n AND T.SpeciesId = @p_SpeciesId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(SpeciesId, EcozoneId) VALUES(@p_SpeciesId, s.n)
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	-- Ecoregions
	MERGE SpeciesEcoregions AS T
	USING @p_ecoregions AS S
	ON (T.EcoregionId = S.n AND T.SpeciesId = @p_SpeciesId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(SpeciesId, EcoregionId) VALUES(@p_SpeciesId, s.n)
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	-- Protected Areas
	MERGE SpeciesProtectedAreas AS T
	USING @p_protectedAreas AS S
	ON (T.ProtectedAreaId = S.n AND T.SpeciesId = @p_SpeciesId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(SpeciesId, ProtectedAreaId) VALUES(@p_SpeciesId, s.n)
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	-- Populations
	MERGE SpeciesPopulations AS T
	USING @p_populations AS S
	ON (T.Name = S.Name AND T.SpeciesId = @p_SpeciesId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(SpeciesId, Name) VALUES (@p_SpeciesId, s.Name)
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	-- References
	MERGE SpeciesReferences AS T
	USING @p_references AS S
	ON (T.ReferenceCategoryId = S.n AND T.ReferenceId = S.p AND T.SpeciesId = @p_SpeciesId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(SpeciesId, ReferenceId, ReferenceCategoryId) VALUES(@p_SpeciesId, s.p, s.n)
	WHEN NOT MATCHED BY SOURCE
		THEN DELETE; 

	SELECT 
		LastUpdated 
	FROM
		dbo.Species
	WHERE
		SpeciesId = @p_SpeciesId
RETURN 0
GO

GRANT EXECUTE ON [dbo].[BioDiversity_Update] TO [WMISUser]
GO
