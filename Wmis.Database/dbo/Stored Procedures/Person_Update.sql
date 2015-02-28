CREATE PROCEDURE [dbo].[Person_Update]
	@p_PersonId INT,
	@p_Username	NVARCHAR(50),
	@p_Name NVARCHAR(50),
	@p_roleKeys [IntTableType] READONLY,
	@p_projectKeys [IntTableType] READONLY
AS
	UPDATE 
		dbo.Person 
	SET
		Username = @p_Username, 
		Name  = @p_Name
	WHERE 
		PersonId = @p_PersonId

	MERGE PersonProjects AS T
	USING @p_projectKeys AS S
	ON (T.ProjectId = S.n AND T.PersonId = @p_PersonId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(PersonId, ProjectId) VALUES(@p_PersonId, s.n)
	WHEN NOT MATCHED BY SOURCE AND T.PersonId = @p_PersonId
		THEN DELETE; 

	MERGE PersonRole AS P
	USING @p_roleKeys AS R
	ON (P.RoleId = R.n AND P.PersonId = @p_PersonId) 
	WHEN NOT MATCHED BY TARGET 
		THEN INSERT(PersonId, RoleId) VALUES(@p_PersonId, r.n)
	WHEN NOT MATCHED BY SOURCE AND P.PersonId = @p_PersonId
		THEN DELETE; 
		
RETURN 0
GO

GRANT EXECUTE ON [dbo].[Person_Update] TO [WMISUser]
GO