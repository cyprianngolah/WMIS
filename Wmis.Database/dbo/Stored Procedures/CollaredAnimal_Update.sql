CREATE PROCEDURE [dbo].[CollaredAnimal_Update]
	@p_CollaredAnimalId INT,
	@p_CollarId NVARCHAR (50),
	@p_SpeciesId NVARCHAR (50),
	@p_SubscriptionId NVARCHAR (50) = NULL,
	@p_VhfFrequency NVARCHAR (50) = NULL,
	@p_CollarTypeId NVARCHAR (50) = NULL,
	@p_JobNumber NVARCHAR (50) = NULL,
	@p_Model NVARCHAR (50) = NULL,
	@p_CollarStatusId INT = NULL,
	@p_CollarMalfunctionId INT = NULL,
	@p_CollarRegionId INT = NULL,
	@p_CollarStateId INT = NULL,
	@p_AnimalStatusId INT = NULL,
	@p_InactiveDate DATETIME = NULL,
	@p_DeploymentDate DATETIME = NULL,
	@p_Size NVARCHAR (50) = NULL,
	@p_BeltingColour NVARCHAR (50) = NULL,
	@p_FirmwareVersion NVARCHAR (MAX) = NULL,
	@p_Comments NVARCHAR (MAX) = NULL,
	@p_DropOffDate DATETIME = NULL,
	@p_EstimatedDropOff DATETIME = NULL,
	@p_EstimatedGpsFailure DATETIME = NULL,
	@p_EstimatedGpsBatteryEnd DATETIME = NULL,
	@p_EstimatedVhfFailure DATETIME = NULL,
	@p_EstimatedVhfBatteryEnd DATETIME = NULL,
	@p_EstimatedYearOfBirth INT = NULL,
	@p_EstimatedYearOfBirthBy NVARCHAR (50) = NULL,
	@p_EstimatedYearOfBirthMethod NVARCHAR (50) = NULL,
	@p_SignsOfPredation BIT = NULL,
	@p_EvidenceOfChase BIT = NULL,
	@p_SignsOfScavengers BIT = NULL,
	@p_SnowSinceDeath BIT = NULL,
	@p_SignsOfHumans BIT = NULL,
	@p_ProjectId INT = NULL,
	@p_AgeClassId INT = NULL,
	@p_AnimalSexId INT = NULL,
	@p_AnimalId INT = NULL,
	@p_AnimalMortalityId INT = NULL,
	@p_MortalityDate DATETIME = NULL,
	@p_MortalityConfidenceId INT = NULL,
	@p_MortalityLatitude FLOAT = NULL,
	@p_MortalityLongitude FLOAT = NULL,
	@p_BodyCondition NVARCHAR (MAX) = NULL,
	@p_CarcassPosition NVARCHAR (50) = NULL,
	@p_CarcassComments NVARCHAR (MAX) = NULL,
	@p_HerdPopulationId INT = NULL,
	@p_HerdAssociationConfidenceLevelId INT = NULL,
	@p_HerdAssociationMethodId INT = NULL,
	@p_HerdAssociationDate DATETIME = NULL,
	@p_BreedingStatusId INT = NULL,
	@p_BreedingStatusConfidenceLevelId INT = NULL,
	@p_BreedingStatusMethodId INT = NULL,
	@p_BreedingStatusDate DATETIME = NULL
AS

	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND @p_ProjectId IS NOT NULL
		AND ProjectId != @p_ProjectId
	)
	BEGIN
		INSERT INTO CollarHistory (CollaredAnimalId, ActionTaken) VALUES (@p_CollaredAnimalId, "Assigned Project ID = " + CAST(@p_ProjectId AS VARCHAR(13)))
	END

	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND @p_ProjectId IS NULL
		AND ProjectId IS NOT NULL
	)
	BEGIN
		INSERT INTO CollarHistory (CollaredAnimalId, ActionTaken) VALUES (@p_CollaredAnimalId, "Unassigned Project")
	END

	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarRegionId != @p_CollarRegionId
	)
	BEGIN
		INSERT INTO CollarHistory (CollaredAnimalId, ActionTaken) VALUES (@p_CollaredAnimalId, "Assigned Region = " + (SELECT Name from CollarRegions where CollarRegionId = @p_CollarRegionId))
	END


	UPDATE
		dbo.CollaredAnimals
	SET
		CollarId = @p_CollarId,
		SpeciesId = @p_SpeciesId,
		SubscriptionId = @p_SubscriptionId,
		VhfFrequency = @p_VhfFrequency,
		CollarTypeId = @p_CollarTypeId,
		JobNumber = @p_JobNumber,
		Model = @p_Model,
		CollarRegionId = @p_CollarRegionId,
		InactiveDate = @p_InactiveDate,
		DeploymentDate = @p_DeploymentDate,
		Size = @p_Size,
		BeltingColour = @p_BeltingColour,
		FirmwareVersion = @p_FirmwareVersion,
		Comments = @p_Comments,
		DropOffDate = @p_DropOffDate,
		EstimatedDropOff = @p_EstimatedDropOff,
		EstimatedGpsFailure = @p_EstimatedGpsFailure,
		EstimatedGpsBatteryEnd = @p_EstimatedGpsBatteryEnd,
		EstimatedVhfFailure = @p_EstimatedVhfFailure,
		EstimatedVhfBatteryEnd = @p_EstimatedVhfBatteryEnd,
		EstimatedYearOfBirth = @p_EstimatedYearOfBirth,
		EstimatedYearOfBirthBy = @p_EstimatedYearOfBirthBy,
		EstimatedYearOfBirthMethod = @p_EstimatedYearOfBirthMethod,
		CollarStatusId = @p_CollarStatusId,
		CollarMalfunctionId = @p_CollarMalfunctionId,
		CollarStateId = @p_CollarStateId,
		ProjectId = @p_ProjectId,
		SignsOfPredation = @p_SignsOfPredation,
		EvidenceOfChase = @p_EvidenceOfChase,
		SignsOfScavengers = @p_SignsOfScavengers,
		SnowSinceDeath = @p_SnowSinceDeath,
		SignsOfHumans = @p_SignsOfHumans,
		AnimalStatusId = @p_AnimalStatusId,
		AgeClassId = @p_AgeClassId,
		AnimalSexId = @p_AnimalSexId,
		AnimalId = @p_AnimalId,
		AnimalMortalityId = @p_AnimalMortalityId,
		MortalityDate = @p_MortalityDate,
		MortalityConfidenceId = @p_MortalityConfidenceId,
		MortalityLatitude = @p_MortalityLatitude,
		MortalityLongitude = @p_MortalityLongitude,
		BodyCondition = @p_BodyCondition,
		CarcassPosition = @p_CarcassPosition,
		CarcassComments = @p_CarcassComments,
		HerdPopulationId = @p_HerdPopulationId,
		HerdAssociationConfidenceLevelId = @p_HerdAssociationConfidenceLevelId,
		HerdAssociationMethodId = @p_HerdAssociationMethodId,
		HerdAssociationDate = @p_HerdAssociationDate,
		BreedingStatusId = @p_BreedingStatusId,
		BreedingStatusConfidenceLevelId = @p_BreedingStatusConfidenceLevelId,
		BreedingStatusMethodId = @p_BreedingStatusMethodId,
		BreedingStatusDate = @p_BreedingStatusDate,
		LastUpdated = GETUTCDATE()
	WHERE
		CollaredAnimalId = @p_CollaredAnimalId 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimal_Update] TO [WMISUser]
GO