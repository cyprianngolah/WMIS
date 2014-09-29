IF NOT EXISTS (SELECT 1 FROM dbo.[Role] WHERE [Name] = 'Project Lead')
BEGIN
	INSERT INTO dbo.[Role] ([Name])
	VALUES ('Project Lead')
END
GO
