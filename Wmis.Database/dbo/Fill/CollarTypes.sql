SET IDENTITY_INSERT [dbo].[CollarTypes] ON;

MERGE INTO dbo.[CollarTypes] as [Target]
USING (VALUES
	(1, 'Argos'),
	(2, 'Lotek')
)
AS [Source] ([CollarTypeId], [Name]) 
ON [Target].[CollarTypeId] = [source].[CollarTypeId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarTypeId], [Name]) VALUES ([CollarTypeId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[CollarTypes] OFF;