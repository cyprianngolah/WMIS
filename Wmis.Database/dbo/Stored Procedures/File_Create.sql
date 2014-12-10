CREATE PROCEDURE [dbo].[File_Create]
	@p_collaredAnimalId INT = NULL,
	@p_projectId INT = NULL,
	@p_name NVARCHAR(50),
	@p_path NVARCHAR(MAX)
AS

	INSERT INTO dbo.Files (CollaredAnimalId, ProjectId, Name, Path)
	VALUES (@p_collaredAnimalId, @p_projectId, @p_name, @p_path)	

RETURN 0
GO

GRANT EXECUTE ON [dbo].[File_Create] TO [WMISUser]
GO