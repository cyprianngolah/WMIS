CREATE PROCEDURE [dbo].[AnimalMortality_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_animalMortalityId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.AnimalMortalityId  as [Key],
		t.Name
	FROM
		dbo.AnimalMortalities t
	WHERE
		t.AnimalMortalityId = ISNULL(@p_animalMortalityId, t.AnimalMortalityId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[AnimalMortality_Get] TO [WMISUser]
GO