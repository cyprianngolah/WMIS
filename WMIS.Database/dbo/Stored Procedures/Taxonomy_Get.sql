CREATE PROCEDURE [dbo].[Taxonomy_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_keywords NVARCHAR(50) = NULL,
	@p_taxonomyId INT = NULL,
	@p_taxonomyGroupId INT = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.TaxonomyId  as [Key],
		t.Name,
		tg.TaxonomyGroupId AS [Key], 
		tg.Name
	FROM
		dbo.Taxonomy t
			INNER JOIN dbo.TaxonomyGroups tg ON t.TaxonomyGroupId = tg.TaxonomyGroupId
	WHERE
		t.TaxonomyId = ISNULL(@p_taxonomyId, t.TaxonomyId)
		AND t.TaxonomyGroupId = ISNULL(@p_taxonomyGroupId, t.TaxonomyGroupId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT 
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO