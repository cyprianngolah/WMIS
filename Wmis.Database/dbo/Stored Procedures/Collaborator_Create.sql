CREATE PROCEDURE [dbo].[Collaborator_Create]
    @p_projectId INT = NULL, 
    @p_name NVARCHAR(50), 
    @p_organization NVARCHAR(50) = NULL, 
    @p_email NVARCHAR(50) = NULL, 
    @p_phoneNumber NVARCHAR(50) = NULL
AS

	INSERT INTO dbo.Collaborators (Name, Organization, Email, PhoneNumber)
	VALUES (@p_Name, @p_Organization, @p_Email, @p_PhoneNumber)	

	SELECT SCOPE_IDENTITY()

	IF @p_projectId IS NOT NULL
	BEGIN
		INSERT INTO dbo.ProjectCollaborators(ProjectId, CollaboratorId)
		VALUES (@p_projectId, (SELECT SCOPE_IDENTITY()))
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collaborator_Create] TO [WMISUser]
GO