CREATE PROCEDURE [dbo].[BiodiversityBulkUpload_Update]
	@p_bulkUploadId INT = NULL,
	@p_uploadType NVARCHAR(50),
	@p_originalFileName NVARCHAR(255) = NULL,
	@p_filePath NVARCHAR(255) = NULL,
	@p_fileName NVARCHAR(255) = NULL
AS
	IF (@p_bulkUploadId IS NULL)
	BEGIN
		INSERT INTO
			[dbo].[BulkUploads] ([UploadType], [OriginalFileName], [FilePath], [FileName])
		VALUES
			(@p_uploadType, @p_originalFileName, @p_filePath, @p_fileName)

		SELECT SCOPE_IDENTITY()
	END
RETURN 0