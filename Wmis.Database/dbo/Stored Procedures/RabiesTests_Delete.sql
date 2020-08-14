CREATE PROCEDURE [dbo].[RabiesTests_Delete]
	@p_TestId INT = NULL
AS
		BEGIN
			DELETE FROM
				dbo.RabiesTests
			WHERE
				TestId = @p_TestId
		END
RETURN 0

GRANT EXECUTE ON [dbo].[RabiesTests_Delete] TO [WMISUser]
GO
