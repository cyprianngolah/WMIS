CREATE PROCEDURE [dbo].[ProtectedArea_Save]
	@p_protectedAreaId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.ProtectedAreas WHERE Name = @p_name AND ProtectedAreaId != ISNULL(@p_protectedAreaId, ProtectedAreaId))
	BEGIN
		RAISERROR('Name already exists for specified ProtectedArea and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_protectedAreaId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.ProtectedAreas (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.ProtectedAreas
		SET
			Name = @p_name
		WHERE
			ProtectedAreaId = @p_protectedAreaId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[ProtectedArea_Save] TO [WMISUser]
GO