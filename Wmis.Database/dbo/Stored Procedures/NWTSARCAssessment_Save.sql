CREATE PROCEDURE [dbo].[NwtSarcAssessment_Save]
	@p_nwtSarcAssessmentId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.NwtSarcAssessments WHERE Name = @p_name AND NwtSarcAssessmentId != ISNULL(@p_nwtSarcAssessmentId, NwtSarcAssessmentId))
	BEGIN
		RAISERROR('Name already exists for specified NWT SARC Assesment and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_nwtSarcAssessmentId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.NwtSarcAssessments (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.NwtSarcAssessments
		SET
			Name = @p_name
		WHERE
			NwtSarcAssessmentId = @p_nwtSarcAssessmentId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[NwtSarcAssessment_Save] TO [WMISUser]
GO