IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Jonah Simpson')
BEGIN
	INSERT INTO dbo.Person(Name, Email)
	VALUES ('Jonah Simpson', 'jonah.simpson@gmail.com')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'James Maltby')
BEGIN
	INSERT INTO dbo.Person(Name, Email)
	VALUES ('James Maltby', 'james.maltby@sdcsoftware.com')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Greg Barrett')
BEGIN
	INSERT INTO dbo.Person(Name, Email)
	VALUES ('Greg Barrett', 'greg.barrett@sdcsoftware.com')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Greg Taylor')
BEGIN
	INSERT INTO dbo.Person(Name, Email)
	VALUES ('Greg Taylor', 'greg.tayl@gmail.com')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE Name = 'Lena Schofield')
BEGIN
	INSERT INTO dbo.Person(Name, Email)
	VALUES ('Lena Schofield', 'Lena_Schofield@gov.nt.ca')
END
GO

