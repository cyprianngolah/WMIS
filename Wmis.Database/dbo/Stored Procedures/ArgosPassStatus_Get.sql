CREATE PROCEDURE [dbo].[ArgosPassStatus_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_argosPassStatusId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.ArgosPassStatusId  as [Key],
		t.Name,
		t.isRejected
	FROM
		dbo.ArgosPassStatuses t
	WHERE
		t.ArgosPassStatusId = ISNULL(@p_argosPassStatusId, t.ArgosPassStatusId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPassStatus_Get] TO [WMISUser]
GO