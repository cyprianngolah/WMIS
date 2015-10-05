IF EXISTS ( SELECT * FROM [dbo].[SurveyType] WHERE [SurveyTypeId] NOT IN (1,2,3,4,5,6,7,8) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[SurveyType]] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[SurveyType] ON;

	MERGE INTO [dbo].[SurveyType] as [Target]
	USING (VALUES
		(1, 'Satellite Collar'),
		(2, 'Count'),
		(3, 'Tracks and Sign'),
		(4, 'Habitat'),
		(5, 'Site'),
		(6,'Necropsy'),
		(7,'Capture'),
		(8,'Random'),
		(9,'Collar Locations')
	)
	AS [Source] ([SurveyTypeId], [Name]) 
	ON [Target].[SurveyTypeId] = [source].[SurveyTypeId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTypeId], [Name]) VALUES ([SurveyTypeId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[SurveyType] OFF;
END;
