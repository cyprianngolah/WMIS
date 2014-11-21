CREATE PROCEDURE [dbo].[CollarHistory_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_collaredAnimalKey int
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		c.CollarHistoryId as [Key],
		c.CollaredAnimalId,
		c.ActionTaken,
		c.Comment,
		c.ChangeDate
	FROM
		dbo.CollarHistory c
	WHERE
		c.CollaredAnimalId = @p_collaredAnimalKey
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