SET IDENTITY_INSERT [dbo].[AnimalStatuses] ON;

MERGE INTO dbo.[AnimalStatuses] as [Target]
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