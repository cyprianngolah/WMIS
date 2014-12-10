CREATE PROCEDURE [dbo].[File_Update]
	@p_fileId INT,
	@p_name NVARCHAR (50),
	@p_path NVARCHAR (MAX)
AS
	UPDATE 
		dbo.Files 
	SET
		Name = @p_name,
		Path = @p_path
	WHERE
		FileId = @p_fileId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[File_Update] TO [WMISUser]
GO