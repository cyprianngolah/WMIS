IF EXISTS ( SELECT * FROM  [dbo].[BreedingStatuses] WHERE [BreedingStatusId] NOT IN (1,2) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[BreedingStatuses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[BreedingStatuses] ON;

	MERGE INTO [dbo].[BreedingStatuses] as [Target]
	USING (VALUES
		(1, 'Breeding Cow'),
		(2, 'Non-Breeding Cow')
	)
	AS [Source] ([BreedingStatusId], [Name]) 
	ON [Target].[BreedingStatusId] = [source].[BreedingStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([BreedingStatusId], [Name]) VALUES ([BreedingStatusId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[BreedingStatuses] OFF;
END;
