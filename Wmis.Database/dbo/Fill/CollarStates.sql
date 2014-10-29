SET IDENTITY_INSERT [dbo].[CollarStates] ON;

MERGE INTO dbo.[CollarStates] as [Target]
USING (VALUES
	(1, 'Active'),
	(2, 'Inactive'),
	(3, 'Unknown')
)
AS [Source] ([CollarStateId], [Name]) 
ON [Target].[CollarStateId] = [source].[CollarStateId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([CollarStateId], [Name]) VALUES ([CollarStateId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;

SET IDENTITY_INSERT [dbo].[CollarStates] OFF;
