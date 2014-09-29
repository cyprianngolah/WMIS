/*
	Initial Seeding, this will probably need to get deleted later
*/

IF NOT EXISTS (SELECT * FROM dbo.ProjectStatus WHERE Name = 'Gathering Data')
BEGIN
	INSERT INTO dbo.ProjectStatus (Name)
	VALUES ('Gathering Data')
END
GO


IF NOT EXISTS (SELECT * FROM dbo.ProjectStatus WHERE Name = 'Planning')
BEGIN
	INSERT INTO dbo.ProjectStatus (Name)
	VALUES ('Planning')
END