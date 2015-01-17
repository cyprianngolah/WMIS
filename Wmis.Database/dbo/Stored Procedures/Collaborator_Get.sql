CREATE PROCEDURE [dbo].[Collaborator_Get]
    @p_collaboratorId INT
AS

	SELECT
		c.CollaboratorId as [Key],
		c.Name,
		c.Organization, 
		c.Email, 
		c.PhoneNumber
	FROM
		dbo.Collaborators c
	WHERE
	 @p_CollaboratorId = c.CollaboratorId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Collaborator_Get] TO [WMISUser]
GO