CREATE PROCEDURE [dbo].[CollarType_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_collarTypeId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.CollarTypeId  as [Key],
		t.Name
	FROM
		dbo.CollarTypes t
	WHERE
		t.CollarTypeId = ISNULL(@p_collarTypeId, t.CollarTypeId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarType_Get] TO [WMISUser]
GO