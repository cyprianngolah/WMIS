CREATE PROCEDURE [dbo].[ArgosPass_Update]
	@p_ArgosPassId INT,
	@p_ArgosPassStatusId INT = NULL
AS
	
	UPDATE
		dbo.ArgosPasses
	SET
		ArgosPassStatusId = @p_ArgosPassStatusId
	WHERE
		ArgosPassId = @p_ArgosPassId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Update] TO [WMISUser]
GO