CREATE PROCEDURE [dbo].[NwtSarcAssessment_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_nwtSarcAssessmentId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		t.NwtSarcAssessmentId  as [Key],
		t.Name
	FROM
		dbo.NwtSarcAssessments t
	WHERE
		t.NwtSarcAssessmentId = ISNULL(@p_nwtSarcAssessmentId, t.NwtSarcAssessmentId)
		AND (@p_keywords IS NULL OR t.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		t.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

RETURN 0
GO

GRANT EXECUTE ON [dbo].[NwtSarcAssessment_Get] TO [WMISUser]
GO