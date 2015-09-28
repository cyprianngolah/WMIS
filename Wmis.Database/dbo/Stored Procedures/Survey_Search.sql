CREATE PROCEDURE [dbo].[Survey_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_projectId INT = NULL,
	@p_surveyId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	/*
	EXEC [dbo].[BioDiversity_Search]
	*/

	SELECT 
		COUNT(*) OVER() AS ResultCount,
		s.[SurveyId] AS [Key], 
		s.[ProjectId] as [ProjectKey],
		s.[Description], 
		s.[Method], 
		s.[Results], 
		s.[AircraftType], 
		s.[AircraftCallsign], 
		s.[Pilot], 
		s.[LeadSurveyor], 
		s.[SurveyCrew], 
		s.[ObserverExpertise], 
		s.[AircraftCrewResults], 
		s.[CloudCover], 
		s.[LightConditions], 
		s.[SnowCover], 
		s.[Temperature], 
		s.[Precipitation], 
		s.[WindSpeed], 
		s.[WindDirection], 
		s.[WeatherComments], 
		observationCount.ObsCount AS [ObservationCount],
		s.[StartDate],
		s.[LastUpdated],
		s.[TargetSpeciesId] as [Key], 
		sp.[Name],
		sp.[CommonName],
		s.[SurveyTypeId] as [Key], 
		st.[Name],
		s.[SurveyTemplateId] as [Key],
		ste.[Name]
	FROM
		dbo.Survey s
			LEFT OUTER JOIN dbo.Species sp on s.TargetSpeciesId = sp.SpeciesId
			LEFT OUTER JOIN dbo.SurveyType st on s.SurveyTypeId = st.SurveyTypeId
			LEFT OUTER JOIN dbo.SurveyTemplate ste on s.SurveyTemplateId = ste.SurveyTemplateId
			LEFT OUTER JOIN
			(
				SELECT obUp.SurveyId, COUNT(*) AS ObsCount
				FROM 
					dbo.ObservationRows obr
					INNER JOIN dbo.ObservationUploads obUp on obr.ObservationUploadId = obUp.ObservationUploadId
				GROUP BY obUp.SurveyId
			
			) observationCount ON (s.SurveyId = observationCount.SurveyId)
	WHERE
		s.[ProjectId] = @p_projectId
		AND (
			@p_surveyId IS NULL
			OR s.[SurveyTypeId] = @p_surveyId
		)
		AND (
			@p_keywords IS NULL 
			OR s.[Description] LIKE '%' + @p_keywords + '%' 
		)
	ORDER BY
		CASE WHEN @p_sortBy = 'surveyType' AND @p_sortDirection = '0'
			THEN st.[Name] END ASC,
		CASE WHEN @p_sortBy = 'surveyType' AND @p_sortDirection = '1'
			THEN st.[Name] END DESC,
		CASE WHEN @p_sortBy = 'template' AND @p_sortDirection = '0'
			THEN ste.[Name] END ASC,
		CASE WHEN @p_sortBy = 'template' AND @p_sortDirection = '1'
			THEN ste.[Name] END DESC,
		CASE WHEN @p_sortBy = 'targetSpecies' AND @p_sortDirection = '0'
			THEN sp.[Name] END ASC,
		CASE WHEN @p_sortBy = 'targetSpecies' AND @p_sortDirection = '1'
			THEN sp.[Name] END DESC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '0'
			THEN sp.[CommonName] END ASC,
		CASE WHEN @p_sortBy = 'commonName' AND @p_sortDirection = '1'
			THEN sp.[CommonName] END DESC,
		CASE WHEN @p_sortBy = 'startDate' AND @p_sortDirection = '0'
			THEN s.[StartDate] END ASC,
		CASE WHEN @p_sortBy = 'startDate' AND @p_sortDirection = '1'
			THEN s.[StartDate] END DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
GO

GRANT EXECUTE ON [dbo].[Survey_Search] TO [WMISUser]
GO
