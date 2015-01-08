CREATE PROCEDURE [dbo].[SurveyTemplateColumn_Delete]
	@p_surveyTemplateColumnId INT = NULL
AS
--	IF EXISTS (SELECT 1 FROM dbo.SurveyTemplateColumns WHERE Name = @p_name AND SurveyTemplateId != @p_surveyTemplateId)
--	BEGIN
--		RAISERROR('Column Heading already exists for specified SurveyTemplate and must be unique.', 16, 1) WITH NOWAIT
--	END

	DELETE FROM
		dbo.SurveyTemplateColumns
	WHERE
		SurveyTemplateColumnId = @p_surveyTemplateColumnId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[SurveyTemplateColumn_Delete] TO [WMISUser]
GO