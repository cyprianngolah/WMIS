IF EXISTS ( SELECT * FROM  [dbo].[CollarStatuses] WHERE [CollarStatusId] NOT IN (1,2,3,4,6,9,10,11,12,13,14,15) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[CollarStatuses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[CollarStatuses] ON;

	MERGE INTO [dbo].[CollarStatuses] as [Target]
	USING (VALUES
		(1, 'Deployed', 'Active on an animal'),
		(2, 'Watching', 'Based on review and quality checking of data'),
		(3, 'Stationary', 'In the field retrievability unknown'),
		(4, 'Irretrievable', 'In the field active, determined not retrievable'),
		(6, 'Lost', 'In the field, unable to locate'),
		(9, 'Retrieved', 'On the shelf not yet assessed for refurbish/retire'),
		(10, 'To Be Refurbished', 'On the shelf assessed as a candidate for refurbishing'),
		(11, 'Being Refurbished', 'Offsite for refurbishing'),
		(12, 'Decommissioned', 'On the shelf not worth refurbishing'),
		(13, 'As New', 'In storage ready to be deployed'),
		(14, 'Malfunctioning', 'Collar malfunctioning'),
		(15, 'Released', 'Collar released on schedule')
	)
	AS [Source] ([CollarStatusId], [Name], [Description]) 
	ON [Target].[CollarStatusId] = [source].[CollarStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name], [Description] = [source].[Description]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarStatusId], [Name], [Description]) VALUES ([CollarStatusId], [Name], [Description]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[CollarStatuses] OFF;
END;

UPDATE [dbo].[CollarStatuses] SET [Order] = 1 WHERE [CollarStatusId] = 4;
UPDATE [dbo].[CollarStatuses] SET [Order] = 2 WHERE [CollarStatusId] = 2;
UPDATE [dbo].[CollarStatuses] SET [Order] = 3 WHERE [CollarStatusId] = 1;
UPDATE [dbo].[CollarStatuses] SET [Order] = 4 WHERE [CollarStatusId] = 7;
UPDATE [dbo].[CollarStatuses] SET [Order] = 6 WHERE [CollarStatusId] = 6;
UPDATE [dbo].[CollarStatuses] SET [Order] = 9 WHERE [CollarStatusId] = 8;
UPDATE [dbo].[CollarStatuses] SET [Order] = 10 WHERE [CollarStatusId] = 10;
UPDATE [dbo].[CollarStatuses] SET [Order] = 11 WHERE [CollarStatusId] = 11;
UPDATE [dbo].[CollarStatuses] SET [Order] = 12 WHERE [CollarStatusId] = 12;
UPDATE [dbo].[CollarStatuses] SET [Order] = 13 WHERE [CollarStatusId] = 9;
UPDATE [dbo].[CollarStatuses] SET [Order] = 14 WHERE [CollarStatusId] = 3;
UPDATE [dbo].[CollarStatuses] SET [Order] = 15 WHERE [CollarStatusId] = 5;
