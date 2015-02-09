/*
	Initial Seeding, this will probably need to get updated later


SET IDENTITY_INSERT [dbo].[SurveyTemplateColumns] ON;

MERGE INTO dbo.[SurveyTemplateColumns] as [Target]
USING (VALUES
	(1, 1, 2, 'Latitude', 1, 1),
	(2, 1, 2, 'Longitude', 2, 1),
	(3, 1, 3, 'Timestamp', 3, 1),
	(4, 1, 1, 'Optional Test', 4, 0),
	(5, 2, 2, 'Latitude', 1, 1),
	(6, 2, 2, 'Longitude', 2, 1),
	(7, 2, 3, 'Timestamp', 3, 0),
	(8, 2, 1, 'Optional Test', 4, 0)
)
AS [Source] ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order], [IsRequired])
ON [Target].[SurveyTemplateColumnId] = [source].[SurveyTemplateColumnId]
WHEN NOT MATCHED BY TARGET THEN 
	INSERT ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order], [IsRequired]) 
	VALUES ([SurveyTemplateColumnId], [SurveyTemplateId], [SurveyTemplateColumnTypeId], [Name], [Order], [IsRequired]) 
WHEN MATCHED THEN UPDATE SET 
	[SurveyTemplateId] = [Source].[SurveyTemplateId], 
	[SurveyTemplateColumnTypeId] = [Source].[SurveyTemplateColumnTypeId],
	[Name] = [source].[Name],
	[Order] = [Source].[Order],
	[IsRequired] = [Source].[IsRequired]
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[SurveyTemplateColumns] OFF;

*/