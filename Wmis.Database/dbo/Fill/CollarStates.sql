IF EXISTS ( SELECT * FROM  [dbo].[CollarStates] WHERE [CollarStateId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[CollarStates] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[CollarStates] ON;

	MERGE INTO [dbo].[CollarStates] as [Target]
	USING (VALUES
		(1, 'On'),
		(2, 'Off'),
		(3, 'Unknown')
	)
	AS [Source] ([CollarStateId], [Name]) 
	ON [Target].[CollarStateId] = [source].[CollarStateId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarStateId], [Name]) VALUES ([CollarStateId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[CollarStates] OFF;
END;
