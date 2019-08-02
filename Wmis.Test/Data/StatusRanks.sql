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
