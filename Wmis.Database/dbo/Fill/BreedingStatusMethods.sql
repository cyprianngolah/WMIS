SET IDENTITY_INSERT [dbo].[BreedingStatusMethods] ON;

MERGE INTO dbo.[BreedingStatusMethods] as [Target]
USING (VALUES
	(1, 'GIS Analysis'),
	(2, 'Observed with Calf'),
	(3, 'Observed with Hard Antlers'),
	(4, 'Observed with Udders'),
	(5, 'Observed with Hard Antlers and Udders'),
	(6, 'Pregnancy Test')
)
AS [Source] ([BreedingStatusMethodId], [Name]) 
ON [Target].[BreedingStatusMethodId] = [source].[BreedingStatusMethodId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([BreedingStatusMethodId], [Name]) VALUES ([BreedingStatusMethodId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[BreedingStatusMethods] OFF;