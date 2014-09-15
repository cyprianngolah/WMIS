CREATE PROCEDURE [dbo].[CosewicStatus_Save]
	@p_cosewicStatusId INT = NULL,
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.COSEWICStatus WHERE Name = @p_name AND COSEWICStatusId != ISNULL(@p_cosewicStatusId, COSEWICStatusId))
	BEGIN
		RAISERROR('Name already exists for specified COSEWICStatus and must be unique.', 16, 1) WITH NOWAIT
	END

	IF(@p_cosewicStatusId IS NULL)
	BEGIN
	
		INSERT INTO 
			dbo.COSEWICStatus (Name)
		VALUES
			(@p_name)		
	END
	ELSE
	BEGIN
		UPDATE
			dbo.COSEWICStatus
		SET
			Name = @p_name
		WHERE
			COSEWICStatusId = @p_cosewicStatusId
	END

RETURN 0
GO

GRANT EXECUTE ON [dbo].[CosewicStatus_Save] TO [WMISUser]
GO