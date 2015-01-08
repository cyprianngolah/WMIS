CREATE PROCEDURE [dbo].[SurveyTemplateColumnType_Get] 
AS
	SELECT
		s.SurveyTemplateColumnTypeId  as [Key],
		s.Name
	FROM
		dbo.SurveyTemplateColumnTypes s
	
	ORDER BY
		s.Name
RETURN 0
GO

GRANT EXECUTE ON [dbo].[SurveyTemplateColumnType_Get] TO [WMISUser]
GO