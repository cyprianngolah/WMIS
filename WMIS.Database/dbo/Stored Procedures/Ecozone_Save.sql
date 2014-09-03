CREATE PROCEDURE [dbo].[Ecozone_Save]
	@p_ecozoneId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.Ecozones WHERE Name = @p_name AND EcozoneId != ISNULL(@p_ecozoneId, EcozoneId))
	BEGIN
		RAISERROR('Name already exists for specified Ecozone and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_ecozoneId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.Ecozones (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.Ecozones
		SET
			Name = @p_name
		WHERE
			EcozoneId = @p_ecozoneId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[Ecozone_Save] TO [WMISUser]
GO