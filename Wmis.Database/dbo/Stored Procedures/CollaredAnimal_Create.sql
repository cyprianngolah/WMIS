CREATE PROCEDURE [dbo].[CollaredAnimal_Create]
	@p_collarId NVARCHAR(50)
AS
	INSERT INTO dbo.CollaredAnimals (CollarId)
	VALUES (@p_collarId)

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollaredAnimal_Create] TO [WMISUser]
GO