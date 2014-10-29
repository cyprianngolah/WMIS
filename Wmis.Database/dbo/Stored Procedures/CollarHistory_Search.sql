CREATE PROCEDURE [dbo].[CollarHistory_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_collarKey int
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		c.CollarHistoryId as [Key],
		c.CollarId,
		c.ActionTaken,
		c.Comment,
		c.ChangeDate
	FROM
		dbo.CollarHistory c
	WHERE
		c.CollarId = @p_collarKey
	ORDER BY
		c.ChangeDate DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarHistory_Search] TO [WMISUser]
GO