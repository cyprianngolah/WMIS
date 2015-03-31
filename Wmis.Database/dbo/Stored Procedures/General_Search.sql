CREATE PROCEDURE [dbo].[General_Search] 
	@p_from INT = 0,
	@p_to INT = 50,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
    @p_fromDate DateTime = NULL,
    @p_toDate DateTime = NULL,
    @p_speciesIds IntTableType READONLY,
    @p_nwtSaraStatusIds IntTableType READONLY,
    @p_fedStaraStatusIds IntTableType READONLY,
    @p_rankStatusIds IntTableType READONLY,
    @p_sarcAssessmentIds IntTableType READONLY,
    @p_surveyTypeIds IntTableType READONLY,
    @p_topLatitude FLOAT = NULL,
    @p_topLongitude FLOAT = NULL,
    @p_bottomLatitude FLOAT = NULL,
    @p_bottomLongitude FLOAT = NULL

AS
	SELECT 
		COUNT(*) OVER() as TotalRowCount,
		p.[ProjectId] AS [Key],
		sp.[CommonName] AS [Species],
		ob.[Timestamp] AS [Date],
		ob.[Latitude] as [Latitude],
		ob.[Longitude] as [Longitude],
		st.Name AS [SurveyType],
		'123' as [AnimalId],
		'Bathurst' as [Herd],
		'Male' as [Sex]
	FROM
		dbo.[Project] AS p
		LEFT OUTER JOIN dbo.[Survey] AS s ON (p.ProjectId = s.ProjectId)
		LEFT OUTER JOIN dbo.[SurveyType] AS st ON (s.SurveyTypeId = st.SurveyTypeId)
		LEFT OUTER JOIN dbo.[Species] AS sp ON (sp.SpeciesId = s.TargetSpeciesId)
		LEFT OUTER JOIN dbo.[ObservationUploads] AS up ON (up.SurveyId = s.SurveyId)
		LEFT OUTER JOIN dbo.[ObservationRows] AS ob ON (ob.ObservationUploadId = up.ObservationUploadId)
	WHERE
		(s.TargetSpeciesId IN (SELECT n FROM @p_speciesIds) OR 0 = (SELECT COUNT(*) FROM @p_speciesIds))
		AND (st.SurveyTypeId IN (SELECT n FROM @p_surveyTypeIds) OR 0 = (SELECT COUNT(*) FROM @p_surveyTypeIds))
		-- I'm just not sure what to map these to
		--AND (sp.?? IN (SELECT n FROM @p_nwtSaraStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_nwtSaraStatusIds)) 
		--AND (s.?? IN (SELECT n FROM @p_fedStaraStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_fedStaraStatusIds))
		--AND (sp.?? IN (SELECT n FROM @p_rankStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_rankStatusIds))
		--AND (s.?? IN (SELECT n FROM @p_sarcAssessmentIds) OR 0 = (SELECT COUNT(*) FROM @p_sarcAssessmentIds))
		AND (@p_fromDate IS NULL OR ob.[Timestamp] >= @p_fromDate)
		AND (@p_toDate IS NULL OR ob.[Timestamp] <= @p_toDate)
		AND (@p_topLatitude IS NULL OR ob.Latitude <= @p_topLatitude)
		AND (@p_topLongitude IS NULL OR ob.Longitude >= @p_topLongitude)
		AND (@p_bottomLatitude IS NULL OR ob.Latitude >= @p_bottomLatitude)
		AND (@p_bottomLongitude IS NULL OR ob.Longitude <= @p_bottomLongitude)
	ORDER BY
		ob.[Timestamp] DESC
GO

GRANT EXECUTE ON [dbo].[General_Search] TO [WMISUser]
GO