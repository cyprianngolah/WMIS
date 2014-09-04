-- [dbo].[COSEWICStatus] Reference Data
SET IDENTITY_INSERT [dbo].[COSEWICStatus] ON;
MERGE INTO [dbo].[COSEWICStatus] AS [target]
USING (VALUES 
	(1, N'Endangered'), 
	(2, N'Threatened'),
	(3, N'Special Concern')
) 
AS [source] ([COSEWICStatusId], [Name]) 
ON [target].[COSEWICStatusId] = [source].[COSEWICStatusId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([COSEWICStatusId], [Name]) VALUES ([COSEWICStatusId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[COSEWICStatus] OFF;