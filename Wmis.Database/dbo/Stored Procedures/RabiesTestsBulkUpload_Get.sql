CREATE PROCEDURE [dbo].[RabiesTestsBulkUpload_Get]
	@p_from INT = 0,
	@p_to INT = 500,
	@p_sortBy NVARCHAR(25) = NULL,
	@p_sortDirection INT = NULL,
	@p_bulkUploadId INT = NULL
AS
	SELECT
		COUNT(*) OVER() as TotalRowCount,
		[bu].[BulkUploadId] as [Key],
		[bu].[BulkUploadId],
		[bu].[UploadType],
		[bu].[OriginalFileName],
		[bu].[FilePath],
		[bu].[FileName],
		[bu].[CreatedAt]
	FROM
		[dbo].[RabiesTestsBulkUploads] bu
	ORDER BY
		bu.CreatedAt
	OFFSET 
		@p_from ROWS
	FETCH NEXT
		(@p_to - @p_from) ROWS ONLY
RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTestsBulkUpload_Get] TO [WMISUser]
GO

