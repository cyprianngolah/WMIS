IF EXISTS ( SELECT * FROM  [dbo].[CollarTypes] WHERE [CollarTypeId] NOT IN (1,2,15,16,17,18,19,20) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[CollarTypes] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[CollarTypes] ON;

	MERGE INTO [dbo].[CollarTypes] as [Target]
	USING (VALUES
		(1, 'Telonics - Argos Only'),
		(2, 'Telonics - GPS/Argos'),
		(15,'Telonics - GPS/GlobalStar'),
		(16,'Telonics - GPS/Iridium'),
		(17,'Lotek - Argos'),
		(18,'Lotek - Iridium'),
		(19,'Lotek - GlobalStar'),
		(20,'Vectronic - GPS Plus')
	)
	AS [Source] ([CollarTypeId], [Name]) 
	ON [Target].[CollarTypeId] = [source].[CollarTypeId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarTypeId], [Name]) VALUES ([CollarTypeId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[CollarTypes] OFF;
END;
