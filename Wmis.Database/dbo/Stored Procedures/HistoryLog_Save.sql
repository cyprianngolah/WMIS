CREATE PROCEDURE [dbo].[HistoryLog_Save]
	@p_historyLogId INT,
	@p_comment NVARCHAR(MAX)
AS
		UPDATE
			dbo.HistoryLogs
		SET
			Comment = @p_comment
		WHERE
			HistoryLogId = @p_historyLogId
RETURN 0
GO

GRANT EXECUTE ON [dbo].[HistoryLog_Save] TO [WMISUser]
GO