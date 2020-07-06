CREATE PROCEDURE [dbo].[WolfNecropsy_Delete]
	@p_caseId INT = NULL
AS
		BEGIN
			DELETE FROM
				dbo.WolfNecropsy
			WHERE
				CaseId = @p_caseId
		END
RETURN 0

GRANT EXECUTE ON [dbo].[WolfNecropsy_Delete] TO [WMISUser]
