CREATE PROCEDURE [dbo].[SurveyTemplate_Get]
	@p_surveyTemplateId INT
AS
	SELECT
		st.SurveyTemplateId as [Key],
		st.Name,
		st.DateCreated,
		st.CreatedBy,
		(SELECT COUNT(DISTINCT ProjectId) FROM dbo.Survey s where @p_surveyTemplateId = s.SurveyTemplateId) as ProjectCount
	FROM
		dbo.SurveyTemplate st
	WHERE
		st.SurveyTemplateId = @p_surveyTemplateId
		
GO

GRANT EXECUTE ON [dbo].[SurveyTemplate_Get] TO [WMISUser]
GO
