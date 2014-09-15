CREATE PROCEDURE [dbo].[StatusRank_Save]
	@p_statusRankId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.StatusRanks WHERE Name = @p_name AND StatusRankId != ISNULL(@p_statusRankId, StatusRankId))
	BEGIN
		RAISERROR('Name already exists for specified StatusRank and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_statusRankId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.StatusRanks (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.StatusRanks
		SET
			Name = @p_name
		WHERE
			StatusRankId = @p_statusRankId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[StatusRank_Save] TO [WMISUser]
GO