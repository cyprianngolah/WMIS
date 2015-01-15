/*
	Initial Seeding, this will probably need to get updated later


SET IDENTITY_INSERT [dbo].[ProjectStatus] ON;

MERGE INTO dbo.[ProjectStatus] as [Target]
USING (VALUES
	(1, 'Gathering Data'),
	(2, 'Planning')
)
AS [Source] ([ProjectStatusId], [Name]) 
ON [Target].[ProjectStatusId] = [source].[ProjectStatusId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ProjectStatusId], [Name]) VALUES ([ProjectStatusId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[ProjectStatus] OFF;
*/