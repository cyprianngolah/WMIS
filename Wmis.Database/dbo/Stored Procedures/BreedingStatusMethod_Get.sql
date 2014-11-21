CREATE PROCEDURE [dbo].[BreedingStatusMethod_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_breedingStatusMethodId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.BreedingStatusMethodId  as [Key],
		t.Name
	FROM
		dbo.BreedingStatusMethods t
	WHERE
		t.BreedingStatusMethodId = ISNULL(@p_breedingStatusMethodId, t.BreedingStatusMethodId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[BreedingStatusMethod_Get] TO [WMISUser]
GO