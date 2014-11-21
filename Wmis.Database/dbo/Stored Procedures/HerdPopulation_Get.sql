CREATE PROCEDURE [dbo].[HerdPopulation_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_herdPopulationId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.HerdPopulationId  as [Key],
		t.Name
	FROM
		dbo.HerdPopulations t
	WHERE
		t.HerdPopulationId = ISNULL(@p_herdPopulationId, t.HerdPopulationId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HerdPopulation_Get] TO [WMISUser]
GO