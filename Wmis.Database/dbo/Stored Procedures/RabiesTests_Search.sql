CREATE PROCEDURE [dbo].[RabiesTests_Search]
    @p_TestId INT = 0,
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_year NVARCHAR(20) = NULL,
	@p_species NVARCHAR(30) = NULL,
	@p_community NVARCHAR(30) = NULL,
	@p_testResult NVARCHAR(15) = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	
	SELECT 
		COUNT(*) OVER() AS ResultCount,
	    p.TestId AS [Key], 
		p.DateTested,
		p.DataStatus,
		p.Year,
		p.SubmittingAgency,
		p.LaboratoryIDNo,
		p.TestResult,
		p.Community,
		p.Latitude,
		p.Longitude,
		p.RegionId,
		p.GeographicRegion,
		p.Species,
		p.AnimalContact,
		p.HumanContact,
		p.AnimalContact,
		p.Comments,
		p.LastUpdated

	FROM
		dbo.RabiesTests p
	WHERE
		@p_year IS NULL OR p.[year] = @p_year
		AND (@p_species IS NULL OR p.[species] = @p_species)
		AND (@p_community IS NULL OR p.[community] = @p_community)
				AND (@p_testResult IS NULL OR p.[testResult] = @p_testResult)
		AND (
			@p_keywords IS NULL
			OR p.[year] LIKE '%'+IsNull(p.[Year],@p_keywords)
			OR p.[species] LIKE '%'+IsNull(p.[Species],@p_keywords)
			OR p.[community] LIKE '%'+IsNull(p.[Community],@p_keywords)
			OR p.[testResult] LIKE '%'+IsNull(p.[TestResult],@p_keywords)
		   )
	ORDER BY
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '0'
			THEN p.[Year] END ASC,
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '1'
			THEN p.[Year] END DESC,
		CASE WHEN @p_sortBy = 'CommonName' AND @p_sortDirection = '0'
			THEN p.[Species] END ASC,
		CASE WHEN @p_sortBy = 'CommonName' AND @p_sortDirection = '1'
			THEN p.[Species] END DESC,
		CASE WHEN @p_sortBy = 'Location' AND @p_sortDirection = '0'
			THEN p.[Community] END ASC,
		CASE WHEN @p_sortBy = 'Location' AND @p_sortDirection = '1'
			THEN p.[Community] END DESC,
		CASE WHEN @p_sortBy = 'TestResult' AND @p_sortDirection = '0'
			THEN p.[Community] END ASC,
		CASE WHEN @p_sortBy = 'TestResult' AND @p_sortDirection = '1'
			THEN p.[Community] END DESC
	
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY
RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTests_Search] TO [WMISUser]

