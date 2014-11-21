CREATE PROCEDURE [dbo].[AgeClass_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_ageClassId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.AgeClassId  as [Key],
		t.Name
	FROM
		dbo.AgeClasses t
	WHERE
		t.AgeClassId = ISNULL(@p_ageClassId, t.AgeClassId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[AgeClass_Get] TO [WMISUser]
GO