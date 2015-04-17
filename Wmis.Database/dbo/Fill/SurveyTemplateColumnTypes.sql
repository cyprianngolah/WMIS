IF EXISTS ( SELECT * FROM  [dbo].[SurveyTemplateColumnTypes] WHERE [SurveyTemplateColumnTypeId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[SurveyTemplateColumnTypes] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	MERGE INTO [dbo].[SurveyTemplateColumnTypes] as [Target]
	USING (VALUES
		(1, 'String'),
		(2, 'Numeric'),
		(3, 'Timestamp')
	)
	AS [Source] ([SurveyTemplateColumnTypeId], [Name]) 
	ON [Target].[SurveyTemplateColumnTypeId] = [source].[SurveyTemplateColumnTypeId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTemplateColumnTypeId], [Name]) VALUES ([SurveyTemplateColumnTypeId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;
END;
