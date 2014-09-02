SET IDENTITY_INSERT [dbo].[Ecozones] ON;
MERGE INTO [dbo].[Ecozones] AS [target]
USING (VALUES
	(1, N'Arctic Cordillera'),
	(2, N'Northern Arctic'),
	(3, N'Southern Arctic'),
	(4, N'Taiga Cordillera'),
	(5, N'Taiga Plains'),
	(6, N'Taiga Shield'),
	(7, N'Boreal Cordillera'),
	(8, N'Boreal Plains'),
	(9, N'Hudson Plains'),
	(10, N'Arctic Ocean'),
	(12, N'Atlantic Ocean'),
	(13, N'Beaufort Sea Amundsen Gulf'),
	(14, N'Arctic Basin'),
	(15, N'Viscount Melville Sea Region'),
	(16, N'High Arctic Sea Archipelago'),
	(17, N'Queen Maud Gulf'))
AS [source] ([EcozoneId], [Name]) 
ON [target].[EcozoneId] = [source].[EcozoneId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([EcozoneId], [Name]) VALUES ([EcozoneId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[Ecozones] OFF;