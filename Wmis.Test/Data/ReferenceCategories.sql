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
	(12, N'Ecoregion'),
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
	(32, N'IUCNStatus')
)
AS [source] ([ReferenceCategoryId], [Name]) 
ON [target].[ReferenceCategoryId] = [source].[ReferenceCategoryId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ReferenceCategoryId], [Name]) VALUES ([ReferenceCategoryId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[ReferenceCategories] OFF;