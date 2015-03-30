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
		j.[Key] AS [Key],
		'Caribou' AS [Species],
		j.LocationDate AS [Date],
		j.Latitude as [Latitude],
		j.Longitude as [Longitude],
		'Habitat' AS [SurveyType],
		'123' as [AnimalId],
		'Bathurst' as [Herd],
		'Male' as [Sex]
	FROM
		(SELECT TOP 1 * FROM dbo.Species WHERE SpeciesId IN (SELECT n from @p_speciesIds)) s,
		(SELECT TOP 5 ArgosPassId AS [Key], latitude, longitude, [LocationDate]
		FROM ArgosPasses
		ORDER BY newid()) j
GO

GRANT EXECUTE ON [dbo].[General_Search] TO [WMISUser]
GO