/*
	Initial Seeding, this will probably need to get updated later
*/

MERGE INTO dbo.[SurveyTemplateColumnTypes] as [Target]
USING (VALUES
	(1, 'String'),
	(2, 'Numeric'),
	(3, 'Timestamp')
)
AS [Source] ([SurveyTemplateColumnTypeId], [Name]) 
ON [Target].[SurveyTemplateColumnTypeId] = [source].[SurveyTemplateColumnTypeId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SurveyTemplateColumnTypeId], [Name]) VALUES ([SurveyTemplateColumnTypeId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
