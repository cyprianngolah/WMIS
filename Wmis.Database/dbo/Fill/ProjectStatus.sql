IF EXISTS ( SELECT * FROM  [dbo].[ProjectStatus] WHERE [ProjectStatusId] NOT IN (1,2,3,5,6) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[ProjectStatus] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[ProjectStatus] ON;

	MERGE INTO [dbo].[ProjectStatus] as [Target]
	USING (VALUES
		(1, 'Gathering Data'),
		(2, 'Planning'),
		(3, 'Analysis'),
		(5, 'Canceled'),
		(6, 'Completed')
	)
	AS [Source] ([ProjectStatusId], [Name]) 
	ON [Target].[ProjectStatusId] = [source].[ProjectStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([ProjectStatusId], [Name]) VALUES ([ProjectStatusId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[ProjectStatus] OFF;
END;
