/*
	Initial Seeding, this will probably need to get updated later
*/

SET IDENTITY_INSERT [dbo].[SurveyTemplateColumns] ON;

MERGE INTO dbo.[SurveyTemplateColumns] as [Target]
USING (VALUES
	(1, 1, 2, 'Latitude', 1),
	(2, 1, 2, 'Longitude', 2),
	(3, 1, 3, 'Timestamp', 3),
	(4, 2, 2, 'Latitude', 1),
	(5, 2, 2, 'Longitude', 2),
	(6, 2, 3, 'Timestamp', 3)
)
AS [Source] ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order])
ON [Target].[SurveyTemplateColumnId] = [source].[SurveyTemplateColumnId]
WHEN MATCHED THEN UPDATE SET 
	[SurveyTemplateId] = [Source].[SurveyTemplateId], 
	[SurveyTemplateColumnTypeId] = [Source].[SurveyTemplateColumnTypeId],
	[Name] = [source].[Name],
	[Order] = [Source].[Order]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order]) VALUES ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[SurveyTemplateColumns] OFF;