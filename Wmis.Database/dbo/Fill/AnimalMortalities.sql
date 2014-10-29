SET IDENTITY_INSERT [dbo].[AnimalMortalities] ON;

MERGE INTO dbo.[AnimalMortalities] as [Target]
USING (VALUES
	(1, 'Natural Death'),
	(2, 'Disease'),
	(3, 'Harvested'),
	(4, 'Wolf'),
	(5, 'Predator (Other than wolf)'),
	(6, 'Unknown')
)
AS [Source] ([AnimalMortalityId], [Name]) 
ON [Target].[AnimalMortalityId] = [source].[AnimalMortalityId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([AnimalMortalityId], [Name]) VALUES ([AnimalMortalityId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[AnimalMortalities] OFF;