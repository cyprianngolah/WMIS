SET IDENTITY_INSERT [dbo].[HerdPopulations] ON;

MERGE INTO dbo.[HerdPopulations] as [Target]
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