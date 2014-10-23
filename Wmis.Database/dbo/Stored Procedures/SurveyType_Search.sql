CREATE PROCEDURE [dbo].[SurveyType_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_surveyTypeIdId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		st.SurveyTypeId as [Key],
		st.Name
	FROM
		dbo.SurveyType st
	WHERE
		st.SurveyTypeId = ISNULL(@p_surveyTypeIdId, st.SurveyTypeId)
		AND (@p_keywords IS NULL OR st.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		st.Name
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[SurveyType_Search] TO [WMISUser]
GO
