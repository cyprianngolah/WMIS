CREATE PROCEDURE [dbo].[ObservationRow_Update]
	@p_observationRowId INT,
	@p_argosPassStatusId INT = NULL
AS

	UPDATE 
		ObservationRows
	SET 
		ObservationRowStatusId = @p_argosPassStatusId
	WHERE 
		ObservationRowId = @p_observationRowId

RETURN 0

GRANT EXECUTE ON [dbo].[ObservationRow_Update] TO [WMISUser]
GO