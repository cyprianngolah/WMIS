IF EXISTS ( SELECT * FROM  [dbo].[AgeClasses] WHERE [AgeClassId] NOT IN (1,2,3,4,5) )
BEGIN
	; THROW 51000, 'Records found in [dbo].[AgeClasses] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[AgeClasses] ON;

	MERGE INTO dbo.[AgeClasses] as [Target]
	USING (VALUES
		(1, 'Young'),
		(2, 'Adult, young'),
		(3, 'Adult, middle aged'),
		(4, 'Adult, old'),
		(5, 'Unknown')
	)
	AS [Source] ([AgeClassId], [Name]) 
	ON [Target].[AgeClassId] = [source].[AgeClassId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([AgeClassId], [Name]) VALUES ([AgeClassId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[AgeClasses] OFF;
END;
