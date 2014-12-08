IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Jonah Simpson')
BEGIN
	INSERT INTO dbo.Person(Name, Email, JobTitle)
	VALUES ('Jonah Simpson', 'jonah.simpson@gmail.com', 'Job Title 1')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'James Maltby')
BEGIN
	INSERT INTO dbo.Person(Name, Email, JobTitle)
	VALUES ('James Maltby', 'james.maltby@sdcsoftware.com', 'Job Title 2')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Greg Barrett')
BEGIN
	INSERT INTO dbo.Person(Name, Email, JobTitle)
	VALUES ('Greg Barrett', 'greg.barrett@sdcsoftware.com', 'Job Title 3')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Greg Taylor')
BEGIN
	INSERT INTO dbo.Person(Name, Email, JobTitle)
	VALUES ('Greg Taylor', 'greg.tayl@gmail.com', 'Job Title 4')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Lena Schofield')
BEGIN
	INSERT INTO dbo.Person(Name, Email, JobTitle)
	VALUES ('Lena Schofield', 'Lena_Schofield@gov.nt.ca', 'Job Title 5')
END
GO

