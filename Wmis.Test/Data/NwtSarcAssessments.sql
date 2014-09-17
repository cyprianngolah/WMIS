SET IDENTITY_INSERT [dbo].[NwtSarcAssessments] ON;
MERGE INTO [dbo].[NwtSarcAssessments] AS [target]
USING (VALUES
	(1,N'Endangered'),
	(2,N'Extinct'),
	(3,N'Extirpated'),
	(4,N'No status'),
	(5,N'Not applicable'),
	(6,N'Not assessed'),
	(7,N'Special Concern'),
	(8,N'Threatened'),
	(9,N'Under Consideration'))
AS [source] ([NwtSarcAssessmentId], [Name]) 
ON [target].[NwtSarcAssessmentId] = [source].[NwtSarcAssessmentId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([NwtSarcAssessmentId], [Name]) VALUES ([NwtSarcAssessmentId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[NwtSarcAssessments] OFF;