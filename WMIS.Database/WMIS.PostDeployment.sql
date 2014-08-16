﻿/*
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
	(31, N'CanadianConservationSignificance'),
	(32, N'IUCNStatus')
)
AS [source] ([ReferenceCategoryId], [Name]) 
ON [target].[ReferenceCategoryId] = [source].[ReferenceCategoryId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ReferenceCategoryId], [Name]) VALUES ([ReferenceCategoryId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[ReferenceCategories] OFF;

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

-- [dbo].[Taxonomy]  Taxonomy Data
SET IDENTITY_INSERT [dbo].[Taxonomy] ON;
MERGE INTO [dbo].[Taxonomy] AS [target]
USING (VALUES 
	(1,12, N'Amphibian'),                                         
	(2,12, N'Bird'),                                               
	(3,12, N'Crustacean'),                                         
	(4,12, N'Fish'),                                               
	(5,12, N'Lichen'),                                             
	(6,12, N'Mammal'),                                             
	(7,12, N'Marine Fish'),                                        
	(8,12, N'Marine Mammal'),                                      
	(9,12, N'Mollusc'),                                            
	(10,12, N'Moss'),                                               
	(11,12, N'Plant'),                                              
	(12,12, N'Reptile'),                                            
	(13,12, N'Dragonfly'),                                          
	(14,12, N'Damselfly'),                                          
	(15,12, N'Tiger beetle'),                                       
	(16,12, N'Butterfly'),                                          
	(17,12, N'Mosquito'),                                           
	(18,12, N'Moth'),                                               
	(19,12, N'Blackfly'),                                           
	(20,12, N'Spider'),                                             
	(21,12, N'Terrestrial snails'),                                 
	(22,12, N'Deer Fly'),                                           
	(23,12, N'Horse Fly'),                                          
	(24,12, N'Carrion Beetle'),                                     
	(25,12, N'Lady Beetle'),                                        
	(26,12, N'Predaceous Diving Beetle'),                           
	(27,12, N'Bee'),                                                
	(28,12, N'Ground Beetle'),                                      
	(29,12, N'Grasshopper'),                                        
	(30,12, N'Firefly'),                                            
	(31,12, N'Leafy Liverwort'),                                    
	(32,12, N'Thallose Liverwort'),                                 
	(33,12, N'Simple Thalloid Liverwort'),                          
	(34,12, N'Ant'),                                                
	(35,12, N'Bee Fly'),                                            
	(36,12, N'Scarab Beetle'),                                      
	(37,12, N'Primitive carrion beetle'),                           
	(38,12, N'Ant-like Flower Beetle'),                             
	(39,12, N'Fungus Weevil'),                                      
	(40,12, N'Soft-bodied Plant Beetle'),                           
	(41,12, N'Leaf-rolling Weevil'),                                
	(42,12, N'Straight-snouted Weevil'),                           
	(43,12, N'Pill Beetle'),                                        
	(44,12, N'Fruitworm'),                                          
	(45,12, N'Soldier Beetle'),                                     
	(46,12, N'Longhorn Beetle'),                                    
	(47,12, N'Minute Bark Beetle'),                                 
	(48,12, N'Leaf Beetle'),                                        
	(49,12, N'Minute Tree-fungus Beetle'),                          
	(50,12, N'Checkered Beetle'),                                   
	(51,12, N'Weevil'),                                             
	(52,12, N'Whirligig Beetle'),                                   
	(53,12, N'Silken Fungus Beetle'),                               
	(54,12, N'Flat Bark Beetle'),                                  
	(55,12, N'Riffle Beetle'),                                      
	(56,12, N'Handsome Fungus Beetle'),                             
	(57,12, N'Plate-thigh Beetle'),                                 
	(58,12, N'Crawling Water Beetle'),                              
	(59,12, N'Variegated Mud-loving Beetle'),                       
	(60,12, N'Clown Beetle'),                                       
	(61,12, N'Minute Moss Beetle'),                                 
	(62,12, N'Water Scavenger Beetle'),                             
	(63,12, N'Short-winged Flower Beetle'),                         
	(64,12, N'Minute Brown Scavenger Beetle'),                      
	(65,12, N'Small Scavenger Beetle'),                             
	(66,12, N'Stag Beetle'),                                        
	(67,12, N'Megalopodid Leaf Beetle'),                            
	(68,12, N'Net-winged Beetle'),                                  
	(69,12, N'False Darkling Beetle'),                              
	(70,12, N'Blister Beetle'),                                     
	(71,12, N'Soft-winged Flower Beetle'),                          
	(72,12, N'Tumbling Flower Beetle'),                             
	(73,12, N'Sap Beetle'),                                         
	(74,12, N'Feather-winged Beetle'),                              
	(75,12, N'Spider Beetle'),                                      
	(76,12, N'Fire-coloured Beetle'),                               
	(77,12, N'Dead Log Beetle'),                                    
	(78,12, N'Narrow-waisted Bark Beetle'),                         
	(79,12, N'Marsh Beetle'),                                       
	(80,12, N'Silvanid Flat Bark Beetle'),                         
	(81,12, N'Click Beetle'),                                       
	(82,12, N'Skin Beetle'),                                        
	(83,12, N'Rove Beetle'),                                       
	(84,12, N'False Longhorn Beetle'),                              
	(85,12, N'Darkling Beetle'),                                    
	(86,12, N'False Metallic Wood-boring Beetle'),                  
	(87,12, N'False Ground Beetle'),                                
	(88,12, N'Hide Beetle'),                                        
	(89,12, N'Bark-gnawing Beetle'),                                
	(90,12, N'Ironclad Beetle'),                                    
	(91,12, N'Freshwater Gastropod'),                               
	(92,12, N'Auger Beetle'),                                       
	(93,12, N'Snout Beetle'),                                       
	(94,12, N'Jewel Beetle'),                                       
	(95,12, N'Metallic Flathead Borer'),                            
	(96,12, N'Bean Leaf Beetle'),                                   
	(97,12, N'Minute Hooded Beetle'),                               
	(98,12, N'Pythid Beetle'),                                      
	(99,12, N'Conifer Bark Beetle'),                                
	(100,12, N'Ravenous Leaf Beetle'),                               
	(101,12, N'Leafhopper'),                                         
	(102,12, N'Tick')                                               

) 
AS [source] ([TaxonomyId],[TaxonomyGroupId], [Name]) 
ON [target].[TaxonomyId] = [source].[TaxonomyId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([TaxonomyId],[TaxonomyGroupId], [Name]) VALUES ([TaxonomyId],[TaxonomyGroupId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[Taxonomy] OFF;