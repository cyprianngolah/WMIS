CREATE PROCEDURE [dbo].[Users_Create]
	@p_Username	NVARCHAR(50),
	@p_FirstName NVARCHAR(50),
	@p_LastName NVARCHAR(50),
	@p_AdministratorProjects BIT,
	@p_AdministratorBiodiversity BIT
AS
	INSERT INTO dbo.Users (Username, FirstName, LastName, AdministratorProjects, AdministratorBiodiversity)
	VALUES (@p_Username, @p_FirstName, @p_LastName, @p_AdministratorProjects, @p_AdministratorBiodiversity)

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Users_Create] TO [WMISUser]
GO