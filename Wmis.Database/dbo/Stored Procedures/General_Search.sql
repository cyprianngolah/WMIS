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
		1 AS [Key],
		'species' AS [Species],
		CAST('2015-01-01' AS DateTime) AS [Date],
		63.62884 as [Latitude],
		-113.57977 as [Longitude],
		'surveyType' AS [SurveyType],
		'123' as [AnimalId],
		'herd' as [Herd],
		'sex' as [Sex]
	FROM
		dbo.Species s
	WHERE
		s.NwtSarcAssessmentId IN (SELECT n from @p_speciesIds)
GO

GRANT EXECUTE ON [dbo].[General_Search] TO [WMISUser]
GO