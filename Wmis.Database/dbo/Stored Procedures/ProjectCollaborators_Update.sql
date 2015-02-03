CREATE PROCEDURE [dbo].[ProjectCollaborators_Update]
	@p_collaboratorIds [IntTableType] READONLY,
	@p_projectId INT
AS

MERGE ProjectCollaborators as T
USING @p_collaboratorIds AS S
ON T.CollaboratorId = S.n AND T.ProjectId = @p_projectId
WHEN NOT MATCHED BY TARGET THEN INSERT (ProjectId, CollaboratorId) VALUES (@p_projectId, n) 
WHEN NOT MATCHED BY SOURCE AND T.ProjectId = @p_projectId THEN DELETE;

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ProjectCollaborators_Update] TO [WMISUser]
GO