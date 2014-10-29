CREATE PROCEDURE [dbo].[CollarRegion_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_collarRegionId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.CollarRegionId  as [Key],
		t.Name
	FROM
		dbo.CollarRegions t
	WHERE
		t.CollarRegionId = ISNULL(@p_collarRegionId, t.CollarRegionId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarRegion_Get] TO [WMISUser]
GO