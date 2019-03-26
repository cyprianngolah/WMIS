CREATE PROCEDURE [dbo].[SurveyTemplate_Search]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_surveyTemplateId INT = NULL,
	@p_keywords NVARCHAR(50) = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		st.SurveyTemplateId as [Key],
		st.Name,
		st.DateCreated,
		st.CreatedBy,
		(SELECT COUNT(DISTINCT ProjectId) FROM dbo.Survey s where st.SurveyTemplateId = s.SurveyTemplateId) as ProjectCount
	FROM
		dbo.SurveyTemplate st
	WHERE
		st.SurveyTemplateId = ISNULL(@p_surveyTemplateId, st.SurveyTemplateId)
		AND (@p_keywords IS NULL OR st.Name LIKE '%' + @p_keywords + '%')
	ORDER BY
		st.Name
	--OFFSET 
	--	@p_from ROWS
	--FETCH NEXT
	--	(@p_to - @p_from) ROWS ONLY
	OFFSET 
		@p_from ROWS
	FETCH NEXT 
		@p_to ROWS ONLY

GO

GRANT EXECUTE ON [dbo].[SurveyTemplate_Search] TO [WMISUser]
GO
