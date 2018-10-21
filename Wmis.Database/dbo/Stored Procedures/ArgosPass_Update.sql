CREATE PROCEDURE [dbo].[ArgosPass_Update]
	@p_ArgosPassId INT,
	@p_ArgosPassStatusId INT = NULL,
	@p_Comment NVARCHAR(MAX) = NULL,
	@p_IsLastValidLocation BIT = NULL
AS
	
	-- If location is marked as IsLastValidLocation, 
	-- then reset the IsLastValidLocation for this animal
	-- Also update the Inactive date of the animal to the date of the last valid location
	IF @p_IsLastValidLocation = 1 
		BEGIN
			Update dbo.ArgosPasses
			SET IsLastValidLocation = NULL
			WHERE CollaredAnimalId IN (
							SELECT DISTINCT CollaredAnimalId 
							FROM ArgosPasses 
							WHERE ArgosPassId = @p_ArgosPassId
						)
			-- update the InactiveDate
			Update CollaredAnimals
			SET InactiveDate = ( 
									SELECT LocationDate
									FROM ArgosPasses
									WHERE ArgosPassId = @p_ArgosPassId
								)
			WHERE CollaredAnimalId = (SELECT collaredAnimalId FROM ArgosPasses WHERE ArgosPassId = @p_ArgosPassId)
		END

	-- Update the ArgosPass	
	UPDATE
		dbo.ArgosPasses
	SET
		ArgosPassStatusId = @p_ArgosPassStatusId,
		Comment = @p_Comment,
		ManualQA = 'true',
		IsLastValidLocation = @p_IsLastValidLocation
	WHERE
		ArgosPassId = @p_ArgosPassId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ArgosPass_Update] TO [WMISUser]
GO