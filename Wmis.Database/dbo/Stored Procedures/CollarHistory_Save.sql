CREATE PROCEDURE [dbo].[CollarHistory_Save]
	@p_collarHistoryId INT,
	@p_comment NVARCHAR(MAX)
AS
		UPDATE
			dbo.CollarHistory
		SET
			Comment = @p_comment
		WHERE
			CollarHistoryId = @p_collarHistoryId
RETURN 0
GO

GRANT EXECUTE ON [dbo].[CollarHistory_Save] TO [WMISUser]
GO