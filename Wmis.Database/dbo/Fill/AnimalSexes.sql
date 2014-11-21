SET IDENTITY_INSERT [dbo].[AnimalSexes] ON;

MERGE INTO dbo.[AnimalSexes] as [Target]
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