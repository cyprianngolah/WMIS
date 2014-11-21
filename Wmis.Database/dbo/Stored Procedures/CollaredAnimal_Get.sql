CREATE PROCEDURE [dbo].[CollaredAnimal_Get]
	@p_collaredAnimalKey INT
AS
	SELECT TOP 1
		c.CollaredAnimalId as [Key],
		c.CollarId,
		c.SpeciesId,
		c.SubscriptionId,
		c.VhfFrequency,
		c.JobNumber,
		c.Model,
		c.InactiveDate,
		c.DeploymentDate,
		c.Size,
		c.BeltingColour,
		c.FirmwareVersion,
		c.Comments,
		c.DropOffDate,
		c.EstimatedDropOff,
		c.EstimatedGpsFailure,
		c.EstimatedGpsBatteryEnd,
		c.EstimatedVhfFailure,
		c.EstimatedVhfBatteryEnd,
		c.EstimatedYearOfBirth,
		c.EstimatedYearOfBirthBy,
		c.EstimatedYearOfBirthMethod,
		c.SignsOfPredation,
		c.EvidenceOfChase,
		c.SignsOfScavengers,
		c.SnowSinceDeath,
		c.SignsOfHumans,
		c.AnimalId,
		c.MortalityDate,
		c.MortalityLatitude,
		c.MortalityLongitude,
		c.BodyCondition,
		c.CarcassPosition,
		c.CarcassComments,
		c.HerdAssociationDate,
		c.BreedingStatusDate,
		c.LastUpdated,
		c.ProjectId as [Key],
		project.Name,
		c.CollarTypeId as [Key],
		collarType.Name,
		c.CollarRegionId as [Key],
		collarRegion.Name,
		c.CollarStatusId as [Key],
		collarStatus.Name,
		1 as [Key],		-- Done to ensure the dynamic always maps back to an actual object and not null
		c.CollarMalfunctionId as [CollarMalfunctionKey],
		collarMalfunction.Name as [CollarMalfunctionName],
		c.CollarStateId as [CollarStateKey],
		collarState.Name as [CollarStateName],
		c.AnimalStatusId as [AnimalStatusKey],
		animalStatuses.Name as [AnimalStatusName],
		c.AnimalSexId as [AnimalSexKey],
		animalSexes.Name as [AnimalSexName],
		c.AgeClassId as [AgeClassKey],
		ageClasses.Name as [AgeClassName],
		c.AnimalMortalityId as [AnimalMortalityKey],
		animalMortality.Name as [AnimalMortalityName],
		c.MortalityConfidenceId as [MortalityConfidenceKey],
		mortalityConfidence.Name as [MortalityConfidenceName],
		c.HerdPopulationId as [HerdPopulationKey],
		herdPopulation.Name as [HerdPopulationName],
		c.HerdAssociationConfidenceLevelId as [HerdAssociationConfidenceLevelKey],
		herdAssociationConfidenceLevel.Name as [HerdAssociationConfidenceLevelName],
		c.HerdAssociationMethodId as [HerdAssociationMethodKey],
		herdAssociationMethod.Name as [HerdAssociationMethodName],
		c.BreedingStatusId as [BreedingStatusKey],
		breedingStatus.Name as [BreedingStatusName],
		c.BreedingStatusConfidenceLevelId as [BreedingStatusConfidenceLevelKey],
		breedingStatusConfidenceLevel.Name as [BreedingStatusConfidenceLevelName],
		c.BreedingStatusMethodId as [BreedingStatusMethodKey],
		breedingStatusMethod.Name as [BreedingStatusMethodName]
	FROM
		dbo.CollaredAnimals c
		LEFT OUTER JOIN dbo.CollarStatuses collarStatus on c.CollarStatusId = collarStatus.CollarStatusId
		LEFT OUTER JOIN dbo.CollarMalfunctions collarMalfunction on c.CollarMalfunctionId = collarMalfunction.CollarMalfunctionId
		LEFT OUTER JOIN dbo.CollarStates collarState on c.CollarStateId = collarState.CollarStateId
		LEFT OUTER JOIN dbo.CollarTypes collarType on c.CollarTypeId = collarType.CollarTypeId
		LEFT OUTER JOIN dbo.CollarRegions collarRegion on c.CollarRegionId = collarRegion.CollarRegionId
		LEFT OUTER JOIN dbo.Project project on c.ProjectId = project.ProjectId
		LEFT OUTER JOIN dbo.AnimalStatuses animalStatuses on c.AnimalStatusId = animalStatuses.AnimalStatusId
		LEFT OUTER JOIN dbo.AnimalSexes animalSexes on c.AnimalSexId = animalSexes.AnimalSexId
		LEFT OUTER JOIN dbo.AgeClasses ageClasses on c.AgeClassId = ageClasses.AgeClassId
		LEFT OUTER JOIN dbo.AnimalMortalities animalMortality on c.AnimalMortalityId = AnimalMortality.AnimalMortalityId
		LEFT OUTER JOIN dbo.ConfidenceLevels mortalityConfidence on c.MortalityConfidenceId = mortalityConfidence.ConfidenceLevelId
		LEFT OUTER JOIN dbo.HerdPopulations herdPopulation on c.HerdPopulationId = herdPopulation.HerdPopulationId
		LEFT OUTER JOIN dbo.ConfidenceLevels herdAssociationConfidenceLevel on c.HerdAssociationConfidenceLevelId = herdAssociationConfidenceLevel.ConfidenceLevelId
		LEFT OUTER JOIN dbo.HerdAssociationMethods herdAssociationMethod on c.HerdAssociationMethodId = herdAssociationMethod.HerdAssociationMethodId
		LEFT OUTER JOIN dbo.BreedingStatuses breedingStatus on c.BreedingStatusId = breedingStatus.BreedingStatusId
		LEFT OUTER JOIN dbo.ConfidenceLevels breedingStatusConfidenceLevel on c.BreedingStatusConfidenceLevelId = breedingStatusConfidenceLevel.ConfidenceLevelId
		LEFT OUTER JOIN dbo.BreedingStatusMethods breedingStatusMethod on c.BreedingStatusMethodId = breedingStatusMethod.BreedingStatusMethodId
	WHERE
		c.CollaredAnimalId = @p_collaredAnimalKey

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimal_Get] TO [WMISUser]
GO