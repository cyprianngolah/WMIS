/*
	Initial Seeding, this will probably need to get updated later
*/

SET IDENTITY_INSERT [dbo].[CollarRegions] ON;

MERGE INTO dbo.[CollarRegions] as [Target]
USING (VALUES
	(4, 'Sahtu'),
	(5, 'Inuvik'),
	(2, 'North Slave'),
	(3, 'South Slave'),
	(1, 'Dehcho')
)
AS [Source] ([CollarRegionId], [Name]) 
ON [Target].[CollarRegionId] = [source].[CollarRegionId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarRegionId], [Name]) VALUES ([CollarRegionId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[CollarRegions] OFF;