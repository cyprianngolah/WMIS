/*
	Initial Seeding, this will probably need to get updated later
*/

SET IDENTITY_INSERT [dbo].[SurveyType] ON;

MERGE INTO dbo.[SurveyType] as [Target]
USING (VALUES
	(1, 'Satellite Collar'),
	(2, 'Count'),
	(3, 'Tracks and Sign'),
	(4, 'Habitat'),
	(5, 'Site'),
	(6,'Necropsy'),
	(7,'Capture'),
	(8,'Random')
)
AS [Source] ([SurveyTypeId], [Name]) 
ON [Target].[SurveyTypeId] = [source].[SurveyTypeId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTypeId], [Name]) VALUES ([SurveyTypeId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[SurveyType] OFF;