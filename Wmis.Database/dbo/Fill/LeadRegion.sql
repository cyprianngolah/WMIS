IF EXISTS ( SELECT * FROM  [dbo].[LeadRegion] WHERE [LeadRegionId] NOT IN (1,2,3,4,5,6) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[LeadRegion] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[LeadRegion] ON;

	MERGE INTO [dbo].[LeadRegion] as [Target]
	USING (VALUES
		(1, 'Dehcho'),
		(2, 'Inuvik'),
		(3, 'North Slave'),
		(4, 'Sahtu'),
		(5, 'South Slave'),
		(6, 'Headquarters')
	)
	AS [Source] ([LeadRegionId], [Name]) 
	ON [Target].[LeadRegionId] = [source].[LeadRegionId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([LeadRegionId], [Name]) VALUES ([LeadRegionId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[LeadRegion] OFF;
END;
