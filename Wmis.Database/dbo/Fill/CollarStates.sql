IF EXISTS ( SELECT * FROM  [dbo].[CollarStates] WHERE [CollarStateId] NOT IN (1,2,3,4) )
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
		(3, 'Unknown'),
		(4, 'On - With Warnings')
	)
	AS [Source] ([CollarStateId], [Name]) 
	ON [Target].[CollarStateId] = [source].[CollarStateId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarStateId], [Name]) VALUES ([CollarStateId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[CollarStates] OFF;
END;

UPDATE [dbo].[CollarStates] SET [Order] = 1;
UPDATE [dbo].[CollarStates] SET [Order] = 2 WHERE [CollarStateId] = 4;
UPDATE [dbo].[CollarStates] SET [Order] = 3 WHERE [CollarStateId] = 2;
UPDATE [dbo].[CollarStates] SET [Order] = 4 WHERE [CollarStateId] = 3;
