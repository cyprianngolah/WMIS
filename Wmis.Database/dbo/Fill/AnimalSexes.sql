IF EXISTS ( SELECT * FROM  [dbo].[AnimalSexes] WHERE [AnimalSexId] NOT IN (1,2) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[AnimalSexes] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[AnimalSexes] ON;

	MERGE INTO [dbo].[AnimalSexes] as [Target]
	USING (VALUES
		(1, 'Male'),
		(2, 'Female')
	)
	AS [Source] ([AnimalSexId], [Name]) 
	ON [Target].[AnimalSexId] = [source].[AnimalSexId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([AnimalSexId], [Name]) VALUES ([AnimalSexId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[AnimalSexes] OFF;
END;
