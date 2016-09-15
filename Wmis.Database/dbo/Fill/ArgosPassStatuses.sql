IF EXISTS ( SELECT * FROM  [dbo].[ArgosPassStatuses] WHERE [ArgosPassStatusId] NOT IN (1,2,3,4,5,6,7,8,9,10) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[ArgosPassStatuses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[ArgosPassStatuses] ON;

	MERGE INTO [dbo].[ArgosPassStatuses] as [Target]
	USING (VALUES
		(1, 'Reject - Impassable Terrain', 1),
		(2, 'Reject - Location in Water', 1),
		(3, 'Reject - Unusual Movement', 1),
		(4, 'Warning - Fast Mover', 0),
		(5, 'Warning - Suspected Error', 0),
		(6, 'Warning - Unexpected Reports', 0),
		(7, 'Warning - Possibly Stationary', 0),
		(8, 'Good(without Warnings or Rejections)', 0),
		(9, 'Reject - Mortality', 1),
		(10, 'Reject – Released Collar', 1)
	)
	AS [Source] ([ArgosPassStatusId], [Name], [isRejected]) 
	ON [Target].[ArgosPassStatusId] = [source].[ArgosPassStatusId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name], [isRejected] = [source].[isRejected]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([ArgosPassStatusId], [Name], [isRejected]) VALUES ([ArgosPassStatusId], [Name], [isRejected]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[ArgosPassStatuses] OFF;
END;
