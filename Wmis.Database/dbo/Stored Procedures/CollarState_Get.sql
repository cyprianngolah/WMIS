CREATE PROCEDURE [dbo].[CollarState_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_collarStateId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.CollarStateId  as [Key],
		t.Name
	FROM
		dbo.CollarStates t
	WHERE
		t.CollarStateId = ISNULL(@p_collarStateId, t.CollarStateId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.[Order]
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarState_Get] TO [WMISUser]
GO