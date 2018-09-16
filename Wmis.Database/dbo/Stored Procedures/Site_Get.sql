CREATE PROCEDURE [dbo].[Site_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_siteId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL,
	@p_projectKey INT = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.SiteId  as [Key],
		t.ProjectId AS [ProjectKey],
		t.SiteNumber,
		t.Name,
		t.Latitude,
		t.Longitude,
		t.DateEstablished,
		t.Aspect,
		t.CliffHeight,
		t.Comments,
		t.Habitat,
		t.InitialObserver,
		t.Map,
		t.NearestCommunity,
		t.NestHeight,
		t.NestType,
		t.Reference,
		t.Reliability
	FROM
		dbo.Sites t
	WHERE
		t.SiteId = ISNULL(@p_siteId, t.SiteId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
		AND (t.ProjectId = ISNULL(@p_projectKey, t.ProjectId))
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Site_Get] TO [WMISUser]
GO
