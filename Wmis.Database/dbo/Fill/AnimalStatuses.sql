IF EXISTS ( SELECT * FROM  [dbo].[AnimalStatuses] WHERE [AnimalStatusId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[AnimalStatuses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[AnimalStatuses] ON;

	MERGE INTO [dbo].[AnimalStatuses] as [Target]
	USING (VALUES
		(1, 'Alive'),
		(2, 'Dead'),
		(3, 'Unknown')
	)
	AS [Source] ([AnimalStatusId], [Name]) 
	ON [Target].[AnimalStatusId] = [source].[AnimalStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([AnimalStatusId], [Name]) VALUES ([AnimalStatusId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[AnimalStatuses] OFF;
END;
