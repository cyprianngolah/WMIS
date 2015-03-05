CREATE PROCEDURE [dbo].[File_Create]
	@p_collaredAnimalId INT = NULL,
	@p_projectId INT = NULL,
	@p_speciesId INT = NULL,
	@p_surveyId INT = NULL,
	@p_name NVARCHAR(50),
	@p_path NVARCHAR(MAX)
AS

	INSERT INTO dbo.Files (CollaredAnimalId, ProjectId, SpeciesId, SurveyId, Name, Path)
	VALUES (@p_collaredAnimalId, @p_projectId, @p_speciesId,@p_surveyId, @p_name, @p_path)	

RETURN 0
GO

GRANT EXECUTE ON [dbo].[File_Create] TO [WMISUser]
GO