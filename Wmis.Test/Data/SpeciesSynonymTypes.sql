-- [dbo].[SpeciesSynonymTypes]  Species Synonym Type Data
SET IDENTITY_INSERT [dbo].[SpeciesSynonymTypes] ON;
MERGE INTO [dbo].[SpeciesSynonymTypes] AS [target]
USING (VALUES 
	(1, N'Species'),                                         
	(2, N'Sub Species'),                                         
	(3, N'Common Name'),                                         
	(4, N'Eco Type'),                                         
	(5, N'Population')                                       
) 
AS [source] ([SpeciesSynonymTypeId], [Name]) 
ON [target].[SpeciesSynonymTypeId] = [source].[SpeciesSynonymTypeId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([SpeciesSynonymTypeId], [Name]) VALUES ([SpeciesSynonymTypeId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[SpeciesSynonymTypes] OFF;