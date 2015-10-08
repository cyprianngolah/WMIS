USE [Wmis]
GO
/****** Object:  StoredProcedure [dbo].[General_Search]    Script Date: 10/8/2015 1:04:14 PM ******/
SET ANSI_NULLS OFF
GO
SET QUOTED_IDENTIFIER OFF
GO
ALTER PROCEDURE [dbo].[General_Search] 
	@p_from INT = 0,
	@p_to INT = 50,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
    @p_fromDate DateTime = NULL,
    @p_toDate DateTime = NULL,
    @p_speciesIds IntTableType READONLY,
    @p_nwtSaraStatusIds IntTableType READONLY,
    @p_fedSaraStatusIds IntTableType READONLY,
    @p_rankStatusIds IntTableType READONLY,
    @p_sarcAssessmentIds IntTableType READONLY,
    @p_surveyTypeIds IntTableType READONLY,
    @p_topLatitude FLOAT = NULL,
    @p_topLongitude FLOAT = NULL,
    @p_bottomLatitude FLOAT = NULL,
    @p_bottomLongitude FLOAT = NULL
AS
	
	/*
	EXEC [dbo].[General_Search] 
	*/

	SELECT 
		COUNT(*) OVER() as TotalRowCount,
		d.[Key],
		d.[RowKey],
		d.[ProjectId] AS [ProjectKey],
		sp.[CommonName] AS [Species],
		d.[Date] AS [Date],
		d.[Latitude] as [Latitude],
		d.[Longitude] as [Longitude],
		d.[SurveyTypeId],
		d.[AnimalId],
		d.[Herd],
		d.[Sex]
	FROM
		[dbo].[ConsolidatedAnimalData] d
		INNER JOIN dbo.[Species] AS sp ON (sp.SpeciesId = d.SpeciesId)
		INNER JOIN dbo.[SurveyType] AS st ON (st.SurveyTypeId = d.SurveyTypeId)
	WHERE
		(d.SpeciesId IN (SELECT n FROM @p_speciesIds) OR 0 = (SELECT COUNT(*) FROM @p_speciesIds))
		AND (st.SurveyTypeId IN (SELECT n FROM @p_surveyTypeIds) OR 0 = (SELECT COUNT(*) FROM @p_surveyTypeIds))
		AND (sp.NWTStatusRankId IN (SELECT n FROM @p_nwtSaraStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_nwtSaraStatusIds)) 
		AND (sp.SARAStatusId IN (SELECT n FROM @p_fedSaraStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_fedSaraStatusIds))
		AND (sp.StatusRankId IN (SELECT n FROM @p_rankStatusIds) OR 0 = (SELECT COUNT(*) FROM @p_rankStatusIds))
		AND (sp.NwtSarcAssessmentId IN (SELECT n FROM @p_sarcAssessmentIds) OR 0 = (SELECT COUNT(*) FROM @p_sarcAssessmentIds))
		AND (@p_fromDate IS NULL OR d.[Date] >= @p_fromDate)
		AND (@p_toDate IS NULL OR d.[Date] <= @p_toDate)
		AND (@p_topLatitude IS NULL OR d.Latitude <= @p_topLatitude)
		AND (@p_topLongitude IS NULL OR d.Longitude >= @p_topLongitude)
		AND (@p_bottomLatitude IS NULL OR d.Latitude >= @p_bottomLatitude)
		AND (@p_bottomLongitude IS NULL OR d.Longitude <= @p_bottomLongitude)
	ORDER BY
		d.[Date] DESC
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY