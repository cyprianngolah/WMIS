CREATE PROCEDURE [dbo].[ConfidenceLevel_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_confidenceLevelId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.ConfidenceLevelId  as [Key],
		t.Name
	FROM
		dbo.ConfidenceLevels t
	WHERE
		t.ConfidenceLevelId = ISNULL(@p_confidenceLevelId, t.ConfidenceLevelId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ConfidenceLevel_Get] TO [WMISUser]
GO