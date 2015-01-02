CREATE PROCEDURE [dbo].[ObservationUpload_Get]
	@p_projectId INT = NULL,
	@p_observationUploadId INT = NULL
AS
	
	SELECT
		[ou].[ObservationUploadId] as [Key],
		[ou].[ProjectId] as [ProjectKey],
		[ou].[FilePath], 		
		[ou].[OriginalFileName], 
		[ou].[HeaderRowIndex], 
		[ou].[FirstDataRowIndex], 
		[ou].[IsDeleted],
		[ou].[UploadedTimestamp],
		[ous].[ObservationUploadStatusId] as [Key], 
		[ous].[Name],
		[ouns].[ObservationUploadStatusId] as [Key], 
		[ouns].[Name]
	FROM
		[dbo].[ObservationUploads] ou
			INNER JOIN [dbo].[ObservationUploadStatuses] ous on ous.ObservationUploadStatusId = ou.ObservationUploadStatusId
			LEFT OUTER JOIN [dbo].[ObservationUploadStatuses] ouns on ouns.ObservationUploadStatusId = ous.fkNextObservationUploadStatusId
	WHERE
		[ou].[ProjectId] = ISNULL(@p_projectId, [ou].[ProjectId]) 
		AND [ou].[ObservationUploadId] = ISNULL(@p_observationUploadId, [ou].[ObservationUploadId]) 

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ObservationUpload_Get] TO [WMISUser]
GO