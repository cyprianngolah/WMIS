SET IDENTITY_INSERT [dbo].[Role] ON;

MERGE INTO dbo.[Role] as [Target]
USING (VALUES
	(1, 'Project Lead'),
	(2, 'AdministratorBiodiversity'),
	(3, 'AdministratorProjects')
)
AS [Source] ([RoleId], [Name]) 
ON [Target].[RoleId] = [source].[RoleId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([RoleId], [Name]) VALUES ([RoleId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[Role] OFF;