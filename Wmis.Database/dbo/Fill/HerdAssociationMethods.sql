IF EXISTS ( SELECT * FROM  dbo.[HerdAssociationMethods] WHERE HerdAssociationMethodId NOT IN (1,2,3) )
BEGIN
	; THROW 51000, 'Records found in dbo.[HerdAssociationMethods] other than what exists in the Fill Script.', 1; 
END
ELSE
BEGIN
	SET IDENTITY_INSERT [dbo].[HerdAssociationMethods] ON;
	
	MERGE INTO dbo.[HerdAssociationMethods] as [Target]
	USING (VALUES
		(1, 'GIS Analysis'),
		(2, 'Observed on the Calving Ground'),
		(3, 'Deployment Target') 
	)
	AS [Source] ([HerdAssociationMethodId], [Name]) 
	ON [Target].[HerdAssociationMethodId] = [source].[HerdAssociationMethodId]
	WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
	WHEN NOT MATCHED BY TARGET THEN INSERT ([HerdAssociationMethodId], [Name]) VALUES ([HerdAssociationMethodId], [Name]) 
	WHEN NOT MATCHED BY SOURCE THEN DELETE;

	SET IDENTITY_INSERT [dbo].[HerdAssociationMethods] OFF;
END;