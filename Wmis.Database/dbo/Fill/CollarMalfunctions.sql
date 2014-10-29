SET IDENTITY_INSERT [dbo].[CollarMalfunctions] ON;

MERGE INTO dbo.[CollarMalfunctions] as [Target]
USING (VALUES
	(1, 'VHF failure'),
	(2, 'Premature drop'),
	(3, 'GPS failure'),
	(4, 'Slipped collar'),
	(5, 'Battery failure'),
	(6, 'Unknown')
)
AS [Source] ([CollarMalfunctionId], [Name]) 
ON [Target].[CollarMalfunctionId] = [source].[CollarMalfunctionId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarMalfunctionId], [Name]) VALUES ([CollarMalfunctionId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[CollarMalfunctions] OFF;
