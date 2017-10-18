CREATE PROCEDURE [dbo].[Reference_Get]
	@p_referenceId INT = 0,
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection NVARCHAR(3) = NULL,
	@p_searchString NVARCHAR(25) = NULL,
	@p_yearFilter int = 0
AS
	/*
	EXEC dbo.Reference_Get 0, 25, 'a1'
	*/

	SELECT	
		COUNT(*) OVER() as [TotalCount],
		r.ReferenceId as [Key],
		r.Code,
		r.Author,
		r.Year, 
		r.Title, 
		r.EditionPublicationOrganization, 
		r.VolumePage, 
		r.Publisher, 
		r.City, 
		r.Location
	FROM
		dbo.[References] r
	WHERE
		(@p_referenceId IS NULL OR r.ReferenceId = @p_referenceId)
		AND
		(@p_yearFilter IS NULL OR r.Year = @p_yearFilter)
		AND (
			@p_searchString IS NULL 
			OR (
				r.Code LIKE '%' + @p_searchString + '%'
				or r.Author LIKE '%' + @p_searchString + '%'
				--r.Year
				or r.Title LIKE '%' + @p_searchString + '%'
				--r.EditionPublicationOrganization
				--r.VolumePage
				--r.Publisher 
				--r.City
				--r.Location
			)
		)
	ORDER BY
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '0'
			THEN r.ReferenceId END ASC,
		CASE WHEN @p_sortBy = 'key' AND @p_sortDirection = '1'
			THEN r.ReferenceId END DESC,
		CASE WHEN @p_sortBy = 'code' AND @p_sortDirection = '0'
			THEN r.Code END ASC,
		CASE WHEN @p_sortBy = 'code' AND @p_sortDirection = '1'
			THEN r.Code END DESC,
		CASE WHEN @p_sortBy = 'author' AND @p_sortDirection = '0'
			THEN r.Author END ASC,
		CASE WHEN @p_sortBy = 'author' AND @p_sortDirection = '1'
			THEN r.Author END DESC,
		CASE WHEN @p_sortBy = 'year' AND @p_sortDirection = '0'
			THEN r.Year END ASC,
		CASE WHEN @p_sortBy = 'year' AND @p_sortDirection = '1'
			THEN r.Year END DESC,
		CASE WHEN @p_sortBy = 'title' AND @p_sortDirection = '0'
			THEN r.Title END ASC,
		CASE WHEN @p_sortBy = 'title' AND @p_sortDirection = '1'
			THEN r.Title END DESC,
		CASE WHEN @p_sortBy = 'editionPublicationOrganization' AND @p_sortDirection = '0'
			THEN r.EditionPublicationOrganization END ASC,
		CASE WHEN @p_sortBy = 'editionPublicationOrganization' AND @p_sortDirection = '1'
			THEN r.EditionPublicationOrganization END DESC,
		CASE WHEN @p_sortBy = 'volumePage' AND @p_sortDirection = '0'
			THEN r.VolumePage END ASC,
		CASE WHEN @p_sortBy = 'volumePage' AND @p_sortDirection = '1'
			THEN r.VolumePage END DESC,
		CASE WHEN @p_sortBy = 'publisher' AND @p_sortDirection = '0'
			THEN r.Publisher END ASC,
		CASE WHEN @p_sortBy = 'publisher' AND @p_sortDirection = '1'
			THEN r.Publisher END DESC,
		CASE WHEN @p_sortBy = 'city' AND @p_sortDirection = '0'
			THEN r.City END ASC,
		CASE WHEN @p_sortBy = 'city' AND @p_sortDirection = '1'
			THEN r.City END DESC,
		CASE WHEN @p_sortBy = 'location' AND @p_sortDirection = '0'
			THEN r.Location END ASC,
		CASE WHEN @p_sortBy = 'location' AND @p_sortDirection = '1'
			THEN r.Location END DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY


RETURN 0
GO

GRANT EXECUTE ON [dbo].[Reference_Get] TO [WMISUser]
GO