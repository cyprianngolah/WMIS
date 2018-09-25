
CREATE VIEW [dbo].[vwCollaredAnimalsAndHerds]
AS
WITH herdAssignmentHistory AS(
	SELECT	ROW_NUMBER() OVER (PARTITION BY ca.AnimalId ORDER BY hh.HerdAssociationDate, ca.DeploymentDate) RowNumber,
			ca.*,
			hh.HerdPopulationId as AssignedHerdId,
			hp.name as AssignedHerdName,
			am.name as AssignmentMethod,
			hh.HerdAssociationDate as AssignedHerdAssociationDate
	FROM collaredAnimals ca
	LEFT JOIN [CollaredAnimalHerdAssociationHistory] hh
		ON (ca.CollaredAnimalId = hh.CollaredAnimalId)
	LEFT JOIN HerdPopulations hp
		ON(hh.HerdPopulationId = hp.HerdPopulationId)
	LEFT JOIN HerdAssociationMethods am
		ON(hh.HerdAssociationMethodId = am.HerdAssociationMethodId)
)
,DeploymentHerds AS(
	SELECT	ha.collaredAnimalId,
			ha.AnimalId,
			hp.name as DeploymentHerdName,
			ha.AssignedHerdAssociationDate
	FROM	herdAssignmentHistory ha
	LEFT JOIN HerdPopulations hp
		ON(ha.AssignedHerdId = hp.HerdPopulationId)
	WHERE ha.RowNumber = 1
	AND ha.AssignedHerdId IS NOT NULL
)
,allAnimalHerds as(
	SELECT DISTINCT T1.CollaredAnimalId, T1.AssignmentMethod,
		LTRIM(STUFF((
			SELECT (' > ' + T2.AssignedHerdName + ' (' + CONVERT( VARCHAR, T2.AssignedHerdAssociationDate) + ')')
				FROM herdAssignmentHistory T2
				WHERE T1.CollaredAnimalId = T2.CollaredAnimalId
				ORDER BY T2.HerdAssociationDate
					FOR XML PATH(''), TYPE
				).value('.', 'NVARCHAR(MAX)'), 1, 2,'')) HerdSwitch
	FROM herdAssignmentHistory T1
)
SELECT DISTINCT TOP 100 PERCENT aah.CollaredAnimalId, ca.AnimalId, reg.name Region, sp.CommonName, asex.Name Gender, ca.SubscriptionId PTT, b.DeploymentHerdName DeploymentHerd, 
	DATEPART(yyyy, b.AssignedHerdAssociationDate) DeploymentYear, CONVERT(DATE, b.AssignedHerdAssociationDate) DeploymentDate, hp.Name CurrentHerd, 
	CONVERT(DATE, ca.HerdAssociationDate) HerdAssociationDate, aah.HerdSwitch, astatus.name AnimalStatus, ca.InactiveDate, 
	ca.MortalityDate, ca.MortalityLatitude, ca.MortalityLongitude, am.name MortalityCause, cstate.name CollarState, 
	cstatus.name CollarStatus, ca.Model, ca.VhfFrequency, ctype.name CollarType, p.name Project, ca.CollarId, ca.JobNumber, 
	aprog.ProgramNumber, cmal.name Malfunction, CASE WHEN ca.HasPttBeenReturned = 1 THEN 'Yes' ELSE 'No' END ReturnedToCLS,
	ca.DropOffDate, ca.EstimatedDropOff, ca.Comments,
	BreedingStatus = STUFF((
			SELECT (' > ' + bs.[Name] + ' (' + CONVERT(VARCHAR, sh.BreedingStatusEffectiveDate) + ')')
			FROM BreedingStatuses bs 
			JOIN CollaredAnimalBreedingStatusHistory sh
				ON (bs.BreedingStatusId = sh.BreedingStatusId)
			WHERE sh.CollaredAnimalId = ca.CollaredAnimalId
			ORDER BY sh.BreedingStatusEffectiveDate
				FOR XML PATH (''), TYPE
			).value('.', 'NVARCHAR(MAX)'),1,2,'')
FROM herdAssignmentHistory ca
LEFT JOIN deploymentHerds b ON (ca.AnimalId = b.AnimalId)
LEFT JOIN dbo.HerdPopulations hp ON (ca.HerdPopulationId = hp.HerdPopulationId)
LEFT JOIN allAnimalHerds aah ON (ca.CollaredAnimalId = aah.CollaredAnimalId)
LEFT JOIN dbo.AnimalSexes asex ON (ca.AnimalSexId = asex.AnimalSexId)
LEFT JOIN dbo.AnimalStatuses astatus ON (ca.AnimalStatusId = astatus.AnimalStatusId)
LEFT JOIN dbo.AnimalMortalities am ON (ca.AnimalMortalityId = am.AnimalMortalityId)
LEFT JOIN dbo.CollarStates cstate ON (ca.CollarStateId = cstate.CollarStateId)
LEFT JOIN dbo.CollarStatuses cstatus ON (ca.CollarStatusId = cstatus.CollarStatusId)
LEFT JOIN dbo.CollarTypes ctype ON (ca.CollarTypeId = ctype.CollarTypeId)
LEFT JOIN dbo.Project p ON (ca.ProjectId = p.ProjectId)
LEFT JOIN dbo.CollarMalfunctions cmal ON (ca.CollarMalfunctionId = cmal.CollarMalfunctionId)
LEFT JOIN dbo.CollarRegions reg ON (ca.CollarRegionId = reg.CollarRegionId)
LEFT JOIN dbo.Species sp ON (ca.SpeciesId = sp.SpeciesId)
LEFT JOIN dbo.ArgosPrograms aprog ON (ca.ArgosProgramId = aprog.ArgosProgramId)
ORDER BY DeploymentDate DESC

GO


GRANT SELECT ON [dbo].[vwCollaredAnimalsAndHerds] TO [WMISUser]
GO

