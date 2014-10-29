CREATE PROCEDURE [dbo].[CollarMalfunction_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_collarMalfunctionId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.CollarMalfunctionId  as [Key],
		t.Name
	FROM
		dbo.CollarMalfunctions t
	WHERE
		t.CollarMalfunctionId = ISNULL(@p_collarMalfunctionId, t.CollarMalfunctionId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarMalfunction_Get] TO [WMISUser]
GO