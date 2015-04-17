-- Insert the values into the Argos Users table. These are not managed in the front-end

IF EXISTS ( SELECT * FROM  [dbo].[ArgosUsers] WHERE [ArgosUserId] NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[ArgosUsers] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[ArgosUsers] ON;

	MERGE INTO [dbo].[ArgosUsers] as [Target]
	USING (VALUES
		(1, 'gunn', 'northter'),
		(2, 'sahtu', 'gisewo'),
		(3, 'nagyjohn', 'bluenose')
	)
	AS [Source] ([ArgosUserId], [Name], [Password]) 
	ON [Target].[ArgosUserId] = [source].[ArgosUserId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name], [Password] = [source].[Password]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([ArgosUserId], [Name], [Password]) VALUES ([ArgosUserId], [Name], [Password]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[ArgosUsers] OFF;
END;
GO

-- Insert the values into the Argos Programs table. These are not managed in the front-end
IF EXISTS ( SELECT * FROM  [dbo].[ArgosPrograms] WHERE [ArgosProgramId] NOT IN (1,2,3,4,5,6,7) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[ArgosPrograms] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[ArgosPrograms] ON;

	MERGE INTO [dbo].[ArgosPrograms] as [Target]
	USING (VALUES
		(1, 1, '606'),
		(2, 1, '11606'),
		(3, 1, '31606'),
		(4, 2, '12803'),
		(5, 2, '22803'),
		(6, 3, '1572'),
		(7, 3, '10572')
	)
	AS [Source] ([ArgosProgramId], [ArgosUserId], [ProgramNumber]) 
	ON [Target].[ArgosProgramId] = [source].[ArgosProgramId]
	WHEN MATCHED THEN UPDATE SET [ArgosUserId] = [source].[ArgosUserId], [ProgramNumber] = [source].[ProgramNumber]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([ArgosProgramId], [ArgosUserId], [ProgramNumber]) VALUES ([ArgosProgramId], [ArgosUserId], [ProgramNumber]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[ArgosPrograms] OFF;
END;
