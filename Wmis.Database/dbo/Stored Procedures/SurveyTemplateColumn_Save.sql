CREATE PROCEDURE [dbo].[SurveyTemplateColumn_Save]
	@p_surveyTemplateColumnId INT = NULL,
	@p_surveyTemplateId INT,
	@p_surveyTemplateColumnTypeId INT,
	@p_name NVARCHAR(50),
	@p_order INT,
	@p_isRequired BIT
AS
	IF EXISTS (SELECT 1 FROM dbo.SurveyTemplateColumns WHERE @p_surveyTemplateColumnId IS NULL AND Name = @p_name AND SurveyTemplateId = @p_surveyTemplateId)
	BEGIN
		RAISERROR('Column Heading already exists for specified SurveyTemplate and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_surveyTemplateColumnId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.SurveyTemplateColumns (SurveyTemplateId, SurveyTemplateColumnTypeId, Name, [Order], IsRequired)
		VALUES
			(@p_surveyTemplateId, @p_surveyTemplateColumnTypeId, @p_name, @p_order, @p_isRequired)		

		SELECT SCOPE_IDENTITY()
	END
	ELSE
	BEGIN
		UPDATE
			dbo.SurveyTemplateColumns
		SET
			SurveyTemplateColumnTypeId = @p_surveyTemplateColumnTypeId, Name = @p_name, [Order] = @p_order, IsRequired = @p_isRequired
		WHERE
			SurveyTemplateColumnId = @p_surveyTemplateColumnId

		SELECT @p_surveyTemplateColumnId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[SurveyTemplateColumn_Save] TO [WMISUser]
GO