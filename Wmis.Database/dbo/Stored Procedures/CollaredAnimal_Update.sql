CREATE PROCEDURE [dbo].[CollaredAnimal_Update]
	@p_CollaredAnimalId INT,
	@p_CollarId NVARCHAR (50),
	@p_SpeciesId NVARCHAR (50),
	@p_SubscriptionId NVARCHAR (50) = NULL,
	@p_VhfFrequency NVARCHAR (50) = NULL,
	@p_CollarTypeId NVARCHAR (50) = NULL,
	@p_JobNumber NVARCHAR (50) = NULL,
	@p_ArgosProgramId INT = NULL,
	@p_HasPttBeenReturned BIT = 0,
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
	@p_AnimalId NVARCHAR (50) = NULL,
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
	@p_BreedingStatusDate DATETIME = NULL,
	@p_ChangeBy NVARCHAR(50)
AS
	--Project Assigned
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND @p_ProjectId IS NOT NULL
		AND ProjectId != @p_ProjectId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Assigned Project", (Select Name from Project where ProjectId = @p_ProjectId), @p_ChangeBy)
	END

	--Project Unassigned
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND @p_ProjectId IS NULL
		AND ProjectId IS NOT NULL
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Unassigned Project", "N/A", @p_ChangeBy)
	END

	--Region Assigned
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarRegionId != @p_CollarRegionId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Assigned Region", (SELECT Name from CollarRegions where CollarRegionId = @p_CollarRegionId), @p_ChangeBy)
	END

	--Collar State
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarStateId != @p_CollarStateId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Collar State", (SELECT Name from CollarStates where CollarStateId = @p_CollarStateId), @p_ChangeBy)
	END

	--Collar Status
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarStatusId != @p_CollarStatusId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Collar Status", (SELECT Name from CollarStatuses where CollarStatusId = @p_CollarStatusId), @p_ChangeBy)
	END
	
	--Collar Malfunction
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND CollarMalfunctionId != @p_CollarMalfunctionId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Collar Malfunction", (SELECT Name from CollarMalfunctions where CollarMalfunctionId = @p_CollarMalfunctionId), @p_ChangeBy)
	END

	--Animal Mortality
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND AnimalMortalityId != @p_AnimalMortalityId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Animal Mortality", (SELECT Name from AnimalMortalities where AnimalMortalityId = @p_AnimalMortalityId), @p_ChangeBy)
	END

	--Animal Herd
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND HerdPopulationId != @p_HerdPopulationId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Animal Herd", (SELECT Name from HerdPopulations where HerdPopulationId = @p_HerdPopulationId) + ' (' + (SELECT CONVERT(char(10),  @p_HerdAssociationDate, 101)) + ')', @p_ChangeBy)
	END

	--Animal Breeding
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND BreedingStatusId != @p_BreedingStatusId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Animal Breeding", (SELECT Name from BreedingStatuses where BreedingStatusId = @p_BreedingStatusId) + ' (' + (SELECT CONVERT(char(10),  @p_BreedingStatusDate, 101)) + ')', @p_ChangeBy)
	END

	--Argos Program
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND ArgosProgramId != @p_ArgosProgramId
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Argos Program", (SELECT ProgramNumber from ArgosPrograms where ArgosProgramId = @p_ArgosProgramId), @p_ChangeBy)
	END
	
	--Inactive Date
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND InactiveDate != @p_InactiveDate
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Inactive Date", (SELECT CONVERT(char(10), @p_InactiveDate, 101)), @p_ChangeBy)
	END

	--Drop-off Date
	IF EXISTS (SELECT 1 FROM dbo.CollaredAnimals WHERE
		CollaredAnimalId = @p_CollaredAnimalId
		AND DropOffDate != @p_DropOffDate
	)
	BEGIN
		INSERT INTO HistoryLogs (CollaredAnimalId, Item, Value, ChangeBy) VALUES (@p_CollaredAnimalId, "Drop-Off Date", (SELECT CONVERT(char(10), @p_DropOffDate, 101)), @p_ChangeBy)
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
		ArgosProgramId = @p_ArgosProgramId,
		HasPttBeenReturned = @p_HasPttBeenReturned,
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