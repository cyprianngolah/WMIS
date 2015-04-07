CREATE PROCEDURE [dbo].[Site_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_projectId INT = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.SiteId  as [Key],
		t.ProjectId AS [ProjectKey],
		t.SiteNumber,
		t.Name,
		t.Latitude,
		t.Longitude
	FROM
		dbo.Sites t
	WHERE
		t.ProjectId = ISNULL(@p_projectId, t.ProjectId)
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Site_Search] TO [WMISUser]
GO
