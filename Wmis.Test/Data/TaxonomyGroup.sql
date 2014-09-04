SET IDENTITY_INSERT [dbo].[TaxonomyGroups] ON;
MERGE INTO [dbo].[TaxonomyGroups] AS [target]
USING (VALUES 
	(1, N'Kingdom'), 
	(2, N'Phylum'),
	(3, N'SubPhylum'),
	(4, N'Class'), 
	(5, N'SubClass'),
	(6, N'Order'),
	(7, N'SubOrder'),
	(8, N'InfraOrder'),
	(9, N'SuperFamily'),
	(10, N'Family'),
 	(11, N'SubFamily'),
	(12, N'Group')
) 
AS [source] ([TaxonomyGroupId], [Name]) 
ON [target].[TaxonomyGroupId] = [source].[TaxonomyGroupId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([TaxonomyGroupId], [Name]) VALUES ([TaxonomyGroupId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[TaxonomyGroups] OFF;