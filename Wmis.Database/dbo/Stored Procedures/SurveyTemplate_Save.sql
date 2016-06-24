CREATE PROCEDURE [dbo].[SurveyTemplate_Save]
	@p_surveyTemplateId INT = NULL,
	@p_name NVARCHAR(50),
	@p_createdBy NVARCHAR(50),
	@newRowId int = NULL
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
			(@p_name, @p_createdBy);

		SET @newRowId = SCOPE_IDENTITY();

		INSERT INTO 
			dbo.SurveyTemplateColumns (SurveyTemplateId, IsRequired, Name, SurveyTemplateColumnTypeId, [Order])
		VALUES
			(@newRowId, 1, 'Latitude', (SELECT [SurveyTemplateColumnTypeId] FROM dbo.SurveyTemplateColumnTypes WHERE [Name] = 'Numeric'), 0);

		INSERT INTO 
			dbo.SurveyTemplateColumns (SurveyTemplateId, IsRequired, Name, SurveyTemplateColumnTypeId, [Order])
		VALUES
			(@newRowId, 1, 'Longitude', (SELECT [SurveyTemplateColumnTypeId] FROM dbo.SurveyTemplateColumnTypes WHERE [Name] = 'Numeric'), 1);
			
		INSERT INTO 
			dbo.SurveyTemplateColumns (SurveyTemplateId, IsRequired, Name, SurveyTemplateColumnTypeId, [Order])
		VALUES
			(@newRowId, 1, 'Timestamp', (SELECT [SurveyTemplateColumnTypeId] FROM dbo.SurveyTemplateColumnTypes WHERE [Name] = 'Timestamp'), 2);
			
		INSERT INTO 
			dbo.SurveyTemplateColumns (SurveyTemplateId, IsRequired, Name, SurveyTemplateColumnTypeId, [Order])
		VALUES
			(@newRowId, 0, 'SiteId', (SELECT [SurveyTemplateColumnTypeId] FROM dbo.SurveyTemplateColumnTypes WHERE [Name] = 'Numeric'), 3);

		SELECT @newRowId;
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