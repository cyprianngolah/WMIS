CREATE PROCEDURE [dbo].[File_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_collaredAnimalId INT = NULL,
	@p_projectId INT = NULL,
	@p_speciesId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		f.FileId  as [Key],
		f.Name,
		f.Path
	FROM
		dbo.Files f
	WHERE
		(@p_collaredAnimalId IS NULL OR f.CollaredAnimalId = @p_collaredAnimalId)
		AND (@p_projectId IS NULL OR f.ProjectId = @p_projectId)
		AND (@p_speciesId IS NULL OR f.SpeciesId = @p_speciesId)
		AND (@p_keywords IS NULL OR f.Name LIKE '%' + @p_keywords + '%' OR f.Path LIKE '%' + @p_keywords + '%')
	ORDER BY
		f.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[File_Search] TO [WMISUser]
GO