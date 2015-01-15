/*
	Initial Seeding, this will probably need to get updated later


SET IDENTITY_INSERT [dbo].[SurveyTemplate] ON;

MERGE INTO dbo.[SurveyTemplate] as [Target]
USING (VALUES
	(1, 'Template 1'),
	(2, 'Template 2')
)
AS [Source] ([SurveyTemplateId], [Name]) 
ON [Target].[SurveyTemplateId] = [source].[SurveyTemplateId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTemplateId], [Name]) VALUES ([SurveyTemplateId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[SurveyTemplate] OFF;
*/