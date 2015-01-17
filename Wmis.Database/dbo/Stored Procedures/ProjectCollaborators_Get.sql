CREATE PROCEDURE [dbo].[ProjectCollaborators_Get]
	@p_projectId INT
AS
	SELECT
		c.CollaboratorId as [Key],
		c.Name,
		c.Organization,
		c.Email,
		c.PhoneNumber
	FROM
		dbo.ProjectCollaborators pc
			LEFT OUTER JOIN dbo.Collaborators c on pc.CollaboratorId = c.CollaboratorId
	WHERE
		pc.ProjectId =  @p_projectId
GO

GRANT EXECUTE ON [dbo].[ProjectCollaborators_Get] TO [WMISUser]
GO