IF EXISTS ( SELECT * FROM  [dbo].[HerdPopulations] WHERE [HerdPopulationId] NOT IN (1,2,3,4,5,6,7,8,9,10,11,12) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[HerdPopulations] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[HerdPopulations] ON;

	MERGE INTO [dbo].[HerdPopulations] as [Target]
	USING (VALUES
		(1, 'Tuktoyaktuk Peninsula'),
		(2, 'Cape Bathurst'),
		(3, 'Bluenose East'),
		(4, 'Bluenose West'),
		(5, 'Bathurst'),
		(6, 'Dolphin-Union'),
		(7, 'Peary'),
		(8, 'Beverly and Ahiak'),
		(9, 'Beverly'),
		(10, 'Ahiak'),
		(11, 'Cape Bathurst/Tuktoyaktuk Peninsula'),
		(12, 'Qamanirjuaq')
	)
	AS [Source] ([HerdPopulationId], [Name]) 
	ON [Target].[HerdPopulationId] = [source].[HerdPopulationId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([HerdPopulationId], [Name]) VALUES ([HerdPopulationId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[HerdPopulations] OFF;
END;
