CREATE PROCEDURE [dbo].[ObservationUpload_Update]
	@p_observationUploadId INT = NULL,
	@p_projectId INT = NULL,
	@p_observationUploadStatusId INT = NULL,
	@p_originalFileName NVARCHAR(255) = NULL,
	@p_filePath NVARCHAR(255) = NULL,
	@p_headerRowIndex INT = NULL,
	@p_firstDataRowIndex INT = NULL,
	@p_isDeleted BIT = 0
AS
	IF (@p_observationUploadId IS NULL)
	BEGIN
		INSERT INTO
			[dbo].[ObservationUploads] ([ProjectId], [ObservationUploadStatusId], [OriginalFileName], [FilePath], [UploadedTimestamp], [IsDeleted])
		VALUES
			(@p_projectId, 1, @p_originalFileName, @p_filePath, GETUTCDATE(), 0)

		SELECT SCOPE_IDENTITY()
	END
	ELSE
	BEGIN
		UPDATE
			[dbo].[ObservationUploads]
		SET
			[ObservationUploadStatusId] = ISNULL(@p_observationUploadStatusId, ou.[ObservationUploadStatusId]), 
			[HeaderRowIndex] = ISNULL(@p_headerRowIndex, ou.[HeaderRowIndex]), 
			[FirstDataRowIndex] = ISNULL(@p_firstDataRowIndex, ou.[FirstDataRowIndex]), 
			[IsDeleted] = ISNULL(@p_isDeleted, ou.[IsDeleted]) 
		FROM 
			[dbo].[ObservationUploads] ou
		WHERE
			[ObservationUploadId] = @p_observationUploadId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ObservationUpload_Update] TO [WMISUser]
GO