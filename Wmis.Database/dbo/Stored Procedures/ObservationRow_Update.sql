CREATE PROCEDURE [dbo].[ObservationRow_Update]
	@p_observationRowId INT,
	@p_argosPassStatusId INT = NULL,
	@p_comment NVARCHAR(MAX) = NULL
AS

	UPDATE 
		ObservationRows
	SET 
		ObservationRowStatusId = @p_argosPassStatusId,
		Comment = @p_comment
	WHERE 
		ObservationRowId = @p_observationRowId

RETURN 0

GRANT EXECUTE ON [dbo].[ObservationRow_Update] TO [WMISUser]
GO