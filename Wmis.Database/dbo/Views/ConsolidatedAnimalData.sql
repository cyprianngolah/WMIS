USE [Wmis]
GO

/****** Object:  View [dbo].[ConsolidatedAnimalData]    Script Date: 10/8/2015 1:03:35 PM ******/
DROP VIEW [dbo].[ConsolidatedAnimalData]
GO
CREATE VIEW [dbo].[ConsolidatedAnimalData]
AS
SELECT 
	'C' + CAST(ap.ArgosPassId AS NVARCHAR(10)) AS [Key],
	ap.ArgosPassId AS [RowKey], 
	p.ProjectId as [ProjectId],
	NULL AS [SurveyId],
	s.SpeciesId,
	ap.LocationDate AS [Date], 
	ap.Latitude, 
	ap.Longitude, 
	9 as [SurveyTypeId], 
	ca.CollaredAnimalId as [AnimalId], 
	ca.HerdPopulationId as [Herd], 
	asex.[Name] as [Sex]
FROM
	dbo.ArgosPasses ap
		INNER JOIN dbo.CollaredAnimals ca ON ap.CollaredAnimalId = ca.CollaredAnimalId
		INNER JOIN dbo.Project p ON ca.ProjectId = p.ProjectId
		INNER JOIN dbo.Species s on ca.SpeciesId = s.SpeciesId
		LEFT OUTER JOIN [dbo].[AnimalSexes] asex ON ca.AnimalSexId = asex.AnimalSexId
UNION
SELECT 
	'O' + CAST(ob.ObservationRowId as NVARCHAR(10)) AS [Key],  
	ob.ObservationRowId as [RowKey],
	p.[ProjectId] AS [ProjectId], 
	s.[SurveyId],
	sp.SpeciesId,
	ob.[Timestamp] AS [Date], 
	ob.[Latitude] as [Latitude], 
	ob.[Longitude] as [Longitude], 
	st.SurveyTypeId as [SurveyTypeId], 
	NULL as [AnimalId], 
	NULL as [Herd],
	NULL as [Sex]
FROM
	dbo.[Project] AS p
		INNER JOIN dbo.[Survey] AS s ON (p.ProjectId = s.ProjectId)
		INNER JOIN dbo.[SurveyType] AS st ON (s.SurveyTypeId = st.SurveyTypeId)
		INNER JOIN dbo.[Species] AS sp ON (sp.SpeciesId = s.TargetSpeciesId)
		INNER JOIN dbo.[ObservationUploads] AS up ON (up.SurveyId = s.SurveyId)
		INNER JOIN dbo.[ObservationRows] AS ob ON (ob.ObservationUploadId = up.ObservationUploadId)
WHERE
	up.ObservationUploadStatusId = 4

GO

GRANT SELECT ON [dbo].[ConsolidatedAnimalData] TO [WMISUser]
GO

