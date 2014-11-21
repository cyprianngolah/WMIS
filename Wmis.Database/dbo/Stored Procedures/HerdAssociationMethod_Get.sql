CREATE PROCEDURE [dbo].[HerdAssociationMethod_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_herdAssociationMethodId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.HerdAssociationMethodId  as [Key],
		t.Name
	FROM
		dbo.HerdAssociationMethods t
	WHERE
		t.HerdAssociationMethodId = ISNULL(@p_herdAssociationMethodId, t.HerdAssociationMethodId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HerdAssociationMethod_Get] TO [WMISUser]
GO