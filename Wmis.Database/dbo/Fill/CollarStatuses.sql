IF EXISTS ( SELECT * FROM  [dbo].[CollarStatuses] WHERE [CollarStatusId] NOT IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[CollarStatuses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[CollarStatuses] ON;

	MERGE INTO [dbo].[CollarStatuses] as [Target]
	USING (VALUES
		(1, 'Deployed', 'Active on an animal'),
		(2, 'Suspected Stationary', 'Based on review and quality checking of data'),
		(3, 'Stationary', 'In the field retrievability unknown'),
		(4, 'Irretrievable', 'In the field active, determined not retrievable'),
		(5, 'Found', 'Collar found in the field'),
		(6, 'Lost', 'In the field not retrievable no longer active'),
		(7, 'Released – VHF Active', 'In the field, possibly retrievable'),
		(8, 'Released – VHF Inactive', 'In the field not retrievable no longer active'),
		(9, 'Retrieved', 'On the shelf not yet assessed for refurbish/retire'),
		(10, 'To Be Refurbished', 'On the shelf assessed as a candidate for refurbishing'),
		(11, 'Being Refurbished', 'Offsite for refurbishing'),
		(12, 'Decommissioned', 'On the shelf not worth refurbishing'),
		(13, 'As New', 'In storage ready to be deployed'),
		(14, 'Malfunctioning', 'Collar malfunctioning')
	)
	AS [Source] ([CollarStatusId], [Name], [Description]) 
	ON [Target].[CollarStatusId] = [source].[CollarStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name], [Description] = [source].[Description]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarStatusId], [Name], [Description]) VALUES ([CollarStatusId], [Name], [Description]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[CollarStatuses] OFF;
END;
