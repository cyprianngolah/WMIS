IF EXISTS ( SELECT * FROM  [dbo].[Role] WHERE [RoleId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[Role] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[Role] ON;

	MERGE INTO [dbo].[Role] as [Target]
	USING (VALUES
		(1, 'Project Lead'),
		(2, 'Administrator Biodiversity'),
		(3, 'Administrator Projects'),
		(4, 'Administrator CollaredAnimals')
	)
	AS [Source] ([RoleId], [Name]) 
	ON [Target].[RoleId] = [source].[RoleId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([RoleId], [Name]) VALUES ([RoleId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[Role] OFF;
END;
