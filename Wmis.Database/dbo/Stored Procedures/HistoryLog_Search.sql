CREATE PROCEDURE [dbo].[HistoryLog_Search]
	@p_startRow int = 0,
	@p_rowCount int = 25,
	@p_collaredAnimalId INT = NULL,
	@p_speciesId INT = NULL
AS
	SELECT
		COUNT(*) OVER() AS ResultCount,
		h.HistoryLogId as [Key],
		h.Item,
		h.Value,
		h.Comment,
		h.ChangeBy,
		h.ChangeDate
	FROM
		dbo.HistoryLogs h
	WHERE
		(@p_collaredAnimalId IS NULL OR h.CollaredAnimalId = @p_collaredAnimalId)
		AND (@p_speciesId IS NULL OR h.SpeciesId = @p_speciesId)
	ORDER BY
		h.ChangeDate DESC
	OFFSET 
		@p_startRow ROWS
	FETCH NEXT 
		@p_rowCount ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HistoryLog_Search] TO [WMISUser]
GO