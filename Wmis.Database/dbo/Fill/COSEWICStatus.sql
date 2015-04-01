﻿SET IDENTITY_INSERT [dbo].[COSEWICStatus] ON;

MERGE INTO dbo.[COSEWICStatus] as [Target]
USING (VALUES
	(1, 'Extinct'),
	(2, 'Extirpated'),
	(3, 'Endangered'),
	(4, 'Threatened'),
	(5, 'Special Concern'),
	(6, 'Not At Risk'),
	(7, 'Data Deficient'),
	(8, 'Not Applicable')
)
AS [Source] ([COSEWICStatusId], [Name]) 
ON [Target].[COSEWICStatusId] = [source].[COSEWICStatusId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([COSEWICStatusId], [Name]) VALUES ([COSEWICStatusId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[COSEWICStatus] OFF;