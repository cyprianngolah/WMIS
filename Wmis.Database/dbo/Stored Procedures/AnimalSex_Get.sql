CREATE PROCEDURE [dbo].[AnimalSex_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_animalSexId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.AnimalSexId  as [Key],
		t.Name
	FROM
		dbo.AnimalSexes t
	WHERE
		t.AnimalSexId = ISNULL(@p_animalSexId, t.AnimalSexId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[AnimalSex_Get] TO [WMISUser]
GO