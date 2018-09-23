CREATE PROCEDURE [dbo].[Gabs_ArgosPass_RejectPreDeploymentLocations]
AS
	UPDATE ap
	SET ap.ArgosPassStatusId = 11, -- this is the ID for Reject - Invalid status
		ap.Comment = 'Pre-deployment',
		ap.ManualQA = 1
	FROM 	CollaredAnimals ca
	INNER JOIN ArgosPasses ap 
		ON(ca.collaredAnimalId = ap.CollaredAnimalId)
	WHERE ca.DeploymentDate IS NOT NULL
	AND	(
		ap.ArgosPassStatusId NOT IN (
			SELECT ArgosPassStatusId
			FROM ArgosPassStatuses
			WHERE isRejected = 1
		) 
		OR ap.ArgosPassStatusId IS NULL
	)
	AND ap.LocationDate < ca.DeploymentDate;
RETURN 0

GO

GRANT EXECUTE ON [dbo].[Gabs_ArgosPass_RejectPreDeploymentLocations] TO [WMISUser]
GO