CREATE PROCEDURE [dbo].[ObservationRow_Update]
	@p_observationRowId INT,
	@p_argosPassStatusId INT = NULL,
	@p_comment NVARCHAR(MAX) = NULL,
	@p_updateBy NVARCHAR (50)
AS
	DECLARE @v_surveyId INT, @v_statusName NVARCHAR(250);

	UPDATE 
		ObservationRows
	SET 
		ObservationRowStatusId = @p_argosPassStatusId,
		Comment = @p_comment
	WHERE 
		ObservationRowId = @p_observationRowId;

	SELECT 
		@v_surveyId = ObUp.SurveyId
	FROM [dbo].[ObservationRows] ObRow
		INNER JOIN [dbo].[ObservationUploads] ObUp ON (ObRow.ObservationUploadId = ObUp.ObservationUploadId);
	
	SELECT 
		@v_statusName = Name
	FROM [dbo].[ArgosPassStatuses]
	WHERE ArgosPassStatusId = @p_argosPassStatusId;

	--History Log - QA Observation Row
	INSERT INTO HistoryLogs (SurveyId, Item, Value, Comment, ChangeBy) VALUES (@v_surveyId, 'Observation ' + CAST(@p_observationRowId AS NVARCHAR), COALESCE(@v_statusName, ''), @p_comment, @p_updateBy)

RETURN 0

GRANT EXECUTE ON [dbo].[ObservationRow_Update] TO [WMISUser]
GO