MERGE INTO dbo.[ObservationUploadStatuses] as [Target]
USING (VALUES
	(1, 'File Upload', 2),
	(2, 'Row Select', 3),
	(3, 'Column Mapping', 4),
	(4, 'Data Confirmed', null)
)
AS [Source] ([ObservationUploadStatusId], [Name], [fkNextObservationUploadStatusId]) 
ON [Target].[ObservationUploadStatusId] = [source].[ObservationUploadStatusId]
WHEN NOT MATCHED BY TARGET THEN 
	INSERT ([ObservationUploadStatusId], [Name], [fkNextObservationUploadStatusId]) 
	VALUES ([ObservationUploadStatusId], [Name], [fkNextObservationUploadStatusId]) 
WHEN MATCHED THEN 
	UPDATE 
		SET [Name] = [source].[Name], 
		[fkNextObservationUploadStatusId] = [source].[fkNextObservationUploadStatusId]
WHEN NOT MATCHED BY SOURCE THEN 
	DELETE;
