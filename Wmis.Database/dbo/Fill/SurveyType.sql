/*
	Initial Seeding, this will probably need to get updated later
*/

SET IDENTITY_INSERT [dbo].[SurveyType] ON;

MERGE INTO dbo.[SurveyType] as [Target]
USING (VALUES
	(1, 'Survey Type 1'),
	(2, 'Survey Type 2')
)
AS [Source] ([SurveyTypeId], [Name]) 
ON [Target].[SurveyTypeId] = [source].[SurveyTypeId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTypeId], [Name]) VALUES ([SurveyTypeId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[SurveyType] OFF;