CREATE PROCEDURE [dbo].[File_Delete]
	@p_fileId INT
AS

	DELETE FROM 
		dbo.Files 
	WHERE 
		FileId = @p_fileId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[File_Delete] TO [WMISUser]
GO