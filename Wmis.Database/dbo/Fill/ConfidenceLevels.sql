IF EXISTS ( SELECT * FROM  [dbo].[ConfidenceLevels] WHERE [ConfidenceLevelId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[ConfidenceLevels] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[ConfidenceLevels] ON;

	MERGE INTO [dbo].[ConfidenceLevels] as [Target]
	USING (VALUES
		(1, 'High'),
		(2, 'Medium'),
		(3, 'Low')
	)
	AS [Source] ([ConfidenceLevelId], [Name]) 
	ON [Target].[ConfidenceLevelId] = [source].[ConfidenceLevelId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([ConfidenceLevelId], [Name]) VALUES ([ConfidenceLevelId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[ConfidenceLevels] OFF;
END;
