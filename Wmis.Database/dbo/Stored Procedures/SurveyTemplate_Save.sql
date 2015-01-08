CREATE PROCEDURE [dbo].[SurveyTemplate_Save]
	@p_surveyTemplateId INT = NULL,
	@p_name NVARCHAR(50),
	@p_createdBy NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.SurveyTemplate WHERE Name = @p_name AND SurveyTemplateId != ISNULL(@p_surveyTemplateId, SurveyTemplateId))
	BEGIN
		RAISERROR('Name already exists for specified SurveyTemplate and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_surveyTemplateId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.SurveyTemplate (Name, CreatedBy)
		VALUES
			(@p_name, @p_createdBy)		

		SELECT SCOPE_IDENTITY()
	END
	ELSE
	BEGIN
		UPDATE
			dbo.SurveyTemplate
		SET
			Name = @p_name
		WHERE
			SurveyTemplateId = @p_surveyTemplateId

		SELECT @p_surveyTemplateId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[SurveyTemplate_Save] TO [WMISUser]
GO