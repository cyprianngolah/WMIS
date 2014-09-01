CREATE PROCEDURE [dbo].[BioDiversity_Create]
	@p_name NVARCHAR(50)
AS
	IF EXISTS (SELECT 1 FROM dbo.Species WHERE Name = @p_name)
	BEGIN
		RAISERROR('Biodiversity Name already exists and must be unique.', 16, 1) WITH NOWAIT
	END

	INSERT INTO dbo.Species (Name)
	VALUES (@p_name)

RETURN 0

GRANT EXECUTE ON [dbo].[BioDiversity_Create] TO [WMISUser]
GO