CREATE PROCEDURE [dbo].[Users_Update]
	@p_UserId INT,
	@p_Username	NVARCHAR(50),
	@p_FirstName NVARCHAR(50),
	@p_LastName NVARCHAR(50),
	@p_AdministratorProjects BIT,
	@p_AdministratorBiodiversity BIT,
	@p_projectKeys [IntTableType] READONLY
AS
	UPDATE 
		dbo.Users 
	SET
		Username = @p_Username, 
		FirstName  = @p_FirstName,
		LastName = @p_LastName,
		AdministratorProjects = @p_AdministratorProjects, 
		AdministratorBiodiversity = @p_AdministratorBiodiversity
	WHERE 
		UserId = @p_UserId

	MERGE UserProjects AS T
	USING @p_projectKeys AS S
	ON (T.ProjectId = S.n AND T.UserId = @p_UserId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(UserId, ProjectId) VALUES(@p_UserId, s.n)
	WHEN NOT MATCHED BY SOURCE AND T.UserId = @p_UserId
		THEN DELETE; 
		
RETURN 0
GO

GRANT EXECUTE ON [dbo].[Users_Update] TO [WMISUser]
GO