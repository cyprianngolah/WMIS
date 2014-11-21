CREATE PROCEDURE [dbo].[BreedingStatus_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_breedingStatusId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.BreedingStatusId  as [Key],
		t.Name
	FROM
		dbo.BreedingStatuses t
	WHERE
		t.BreedingStatusId = ISNULL(@p_breedingStatusId, t.BreedingStatusId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[BreedingStatus_Get] TO [WMISUser]
GO