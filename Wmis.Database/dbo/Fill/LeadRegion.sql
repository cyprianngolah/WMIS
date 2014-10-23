/*
	Initial Seeding, this will probably need to get updated later
*/

SET IDENTITY_INSERT [dbo].[LeadRegion] ON;

MERGE INTO dbo.[LeadRegion] as [Target]
USING (VALUES
	(1, 'Lead Region 1'),
	(2, 'Lead Region 2')
)
AS [Source] ([LeadRegionId], [Name]) 
ON [Target].[LeadRegionId] = [source].[LeadRegionId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([LeadRegionId], [Name]) VALUES ([LeadRegionId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[LeadRegion] OFF;