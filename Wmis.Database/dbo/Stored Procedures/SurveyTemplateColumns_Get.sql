CREATE PROCEDURE [dbo].[SurveyTemplateColumns_Get]
	@p_surveyTemplateId int
AS
	
	SELECT
		stc.SurveyTemplateColumnId as [Key],
		stc.SurveyTemplateId,
		stc.Name,
		stc.[Order],
		stc.[IsRequired],
		stct.SurveyTemplateColumnTypeId as [Key],
		stct.Name
	FROM	
		dbo.SurveyTemplateColumns stc
		INNER JOIN dbo.SurveyTemplateColumnTypes stct on stc.SurveyTemplateColumnTypeId = stct.SurveyTemplateColumnTypeId
	WHERE
		stc.SurveyTemplateId = @p_surveyTemplateId
	ORDER BY
		stc.[Order], stc.Name

RETURN 0

GRANT EXECUTE ON [dbo].[SurveyTemplateColumns_Get] TO [WMISUser]
GO