SET IDENTITY_INSERT [dbo].[ConfidenceLevels] ON;

MERGE INTO dbo.[ConfidenceLevels] as [Target]
USING (VALUES
	(1, 'High'),
	(2, 'Medium'),
	(3, 'Low')
)
AS [Source] ([ConfidenceLevelId], [Name]) 
ON [Target].[ConfidenceLevelId] = [source].[ConfidenceLevelId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ConfidenceLevelId], [Name]) VALUES ([ConfidenceLevelId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[ConfidenceLevels] OFF;