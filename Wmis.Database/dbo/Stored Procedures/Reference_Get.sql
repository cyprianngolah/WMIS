CREATE PROCEDURE [dbo].[Reference_Get]
	@p_referenceId INT = 0,
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_searchString NVARCHAR(25) = NULL
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
		r.ReferenceId
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY


RETURN 0
GO

GRANT EXECUTE ON [dbo].[Reference_Get] TO [WMISUser]
GO