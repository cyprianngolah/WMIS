CREATE PROCEDURE [dbo].[ProjectStatus_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_projectStatusId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		pr.ProjectStatusId as [Key],
		pr.Name
	FROM
		dbo.ProjectStatus pr
	WHERE
		pr.ProjectStatusId = ISNULL(@p_projectStatusId, pr.ProjectStatusId)
		AND (@p_keywords IS NULL OR pr.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		pr.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[ProjectStatus_Search] TO [WMISUser]
GO