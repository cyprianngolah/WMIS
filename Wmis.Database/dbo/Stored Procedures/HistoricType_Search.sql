CREATE PROCEDURE [dbo].[HistoryType_Search]
	@p_collaredAnimalId INT = NULL,
	@p_speciesId INT = NULL,
	@p_projectId INT = NULL
AS
	SELECT Distinct 
		h.Item
	FROM
		dbo.HistoryLogs h
	WHERE
		(@p_collaredAnimalId IS NULL OR h.CollaredAnimalId = @p_collaredAnimalId)
		AND (@p_speciesId IS NULL OR h.SpeciesId = @p_speciesId)
		AND (@p_projectId IS NULL OR h.ProjectId = @p_projectId)
	ORDER BY
		h.Item 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HistoryType_Search] TO [WMISUser]
GO