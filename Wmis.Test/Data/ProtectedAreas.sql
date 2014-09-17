SET IDENTITY_INSERT [dbo].[ProtectedAreas] ON;
MERGE INTO [dbo].[ProtectedAreas] AS [target]
USING (VALUES
	(1, N'Wood Buffalo National Park'),
	(2, N'Nahanni National Park Reserve'),
	(3, N'Tuktut Nogait National Park'),
	(4, N'Aulavik National Park'),
	(5, N'Pingo Canadian Landmark Site'),
	(6, N'Sahoy-ehdacho Natl Historic Site'),
	(7, N'Thaidene Nene East Arm Natl Park'),
	(8, N'Naats''ihch''oh Natl Park Reserve'))
AS [source] ([ProtectedAreaId], [Name]) 
ON [target].[ProtectedAreaId] = [source].[ProtectedAreaId]
WHEN MATCHED THEN UPDATE SET [Name] = [source].[Name]
WHEN NOT MATCHED BY TARGET THEN INSERT ([ProtectedAreaId], [Name]) VALUES ([ProtectedAreaId], [Name]) 
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT [dbo].[ProtectedAreas] OFF;