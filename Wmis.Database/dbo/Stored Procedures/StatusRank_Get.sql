CREATE PROCEDURE [dbo].[StatusRank_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_statusRankId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.StatusRankId  as [Key],
		t.Name
	FROM
		dbo.StatusRanks t
	WHERE
		t.StatusRankId = ISNULL(@p_statusRankId, t.StatusRankId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[StatusRank_Get] TO [WMISUser]
GO