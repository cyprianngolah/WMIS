
/*IF EXISTS ( SELECT * FROM  [dbo].[SurveyTemplate] WHERE HerdAssociationMethodId NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[SurveyTemplate] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[SurveyTemplate] ON;

	MERGE INTO [dbo].[SurveyTemplate] as [Target]
	USING (VALUES
		(1, 'Template 1'),
		(2, 'Template 2')
	)
	AS [Source] ([SurveyTemplateId], [Name]) 
	ON [Target].[SurveyTemplateId] = [source].[SurveyTemplateId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTemplateId], [Name]) VALUES ([SurveyTemplateId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[SurveyTemplate] OFF;
END;
*/