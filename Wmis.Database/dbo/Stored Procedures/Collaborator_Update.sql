CREATE PROCEDURE [dbo].[Collaborator_Update]
    @p_collaboratorId INT,
	@p_name NVARCHAR(50), 
    @p_organization NVARCHAR(50) = NULL, 
    @p_email NVARCHAR(50) = NULL, 
    @p_phoneNumber NVARCHAR(50) = NULL
AS

	UPDATE 
		dbo.Collaborators 
	SET
		Name = @p_Name,
		Organization = @p_Organization, 
		Email = @p_Email, 
		PhoneNumber = @p_PhoneNumber
	WHERE
	 @p_CollaboratorId = CollaboratorId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collaborator_Update] TO [WMISUser]
GO