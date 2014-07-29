/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

-- [dbo].[TaxonomyGroups] Reference Data
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

-- [dbo].[StatusRanks] Reference Data
SET IDENTITY_INSERT [dbo].[StatusRanks] ON;
MERGE INTO [dbo].[StatusRanks] AS [target]
USING (VALUES 
	(1, N'At Risk'), 
	(2, N'May Be At Risk'),
	(3, N'Secure'),
	(4, N'Exotic/Alien'), 
	(5, N'Extirpated/Extinct'),
	(6, N'Vagrant/Accidental'),
	(7, N'Sensitive'),
	(8, N'Not Assessed'),
	(9, N'Presence Expected')
)
AS [source] ([StatusRankId], [Name]) 
ON [target].[StatusRankId] = [source].[StatusRankId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([StatusRankId], [Name]) VALUES ([StatusRankId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[StatusRanks] OFF;

-- [dbo].[ReferenceCategories] Reference Data
SET IDENTITY_INSERT [dbo].[ReferenceCategories] ON;
MERGE INTO [dbo].[ReferenceCategories] AS [target]
USING (VALUES 
	(1, N'Naming'), 
	(2, N'Taxonomy'),
	(3, N'CanadianKnownSubSpecies'),
	(4, N'NWTKnownSubSpecies'), 
	(5, N'AgeAtMaturity'),
	(6, N'Reproduction'),
	(7, N'Longevity'),
	(8, N'VegetationReproduction'),
	(9, N'HostFish'),
	(10, N'OtherReproduction'),
	(11, N'Ecozone'),
	(12, N'EcozoneRegion'),
	(13, N'ProtectedArea'),
	(14, N'DistributionInNWT'),
	(15, N'HistoricalDistribution'),
	(16, N'MarineDistribution'),
	(17, N'WinterDistribution'),
	(18, N'Habitat'),
	(19, N'Population'),
	(20, N'Occurences'),
	(21, N'Density'),
	(22, N'Threats'),
	(23, N'ShortTermTrends'),
	(24, N'LongTermTrends'),
	(25, N'Status'),
	(26, N'EconomicStatus'),
	(27, N'COSEWICStatus'),
	(28, N'FederalSpeciesAtRiskStatus'),
	(29, N'NWTSARCAssessment'),
	(30, N'NWTSpeciesAtRiskStatus'),
	(31, N'CanadianConservationSignificance'),
	(32, N'IUCNStatus')
)
AS [source] ([ReferenceCategoryId], [Name]) 
ON [target].[ReferenceCategoryId] = [source].[ReferenceCategoryId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ReferenceCategoryId], [Name]) VALUES ([ReferenceCategoryId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[ReferenceCategories] OFF;