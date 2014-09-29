/*
	Initial Seeding, this will probably need to get deleted later
*/

IF NOT EXISTS (SELECT * FROM dbo.Person p 
		INNER JOIN dbo.PersonRole pr ON p.PersonId = pr.PersonId
		INNER JOIN dbo.[Role] r on r.RoleId = pr.RoleId
	WHERE 
		p.Name = 'Jonah Simpson' AND r.Name = 'Project Lead')
BEGIN
	INSERT INTO 
		dbo.PersonRole (PersonId, RoleId)
	VALUES
		(
			(SELECT TOP 1 PersonId FROM dbo.Person p WHERE p.Name = 'Jonah Simpson'),
			(SELECT TOP 1 RoleId FROM dbo.Role r WHERE r.Name = 'Project Lead')
		)
END
GO


IF NOT EXISTS (SELECT * FROM dbo.Person p 
		INNER JOIN dbo.PersonRole pr ON p.PersonId = pr.PersonId
		INNER JOIN dbo.[Role] r on r.RoleId = pr.RoleId
	WHERE 
		p.Name = 'James Maltby' AND r.Name = 'Project Lead')
BEGIN
	INSERT INTO 
		dbo.PersonRole (PersonId, RoleId)
	VALUES
		(
			(SELECT TOP 1 PersonId FROM dbo.Person p WHERE p.Name = 'James Maltby'),
			(SELECT TOP 1 RoleId FROM dbo.Role r WHERE r.Name = 'Project Lead')
		)
END
GO


IF NOT EXISTS (SELECT * FROM dbo.Person p 
		INNER JOIN dbo.PersonRole pr ON p.PersonId = pr.PersonId
		INNER JOIN dbo.[Role] r on r.RoleId = pr.RoleId
	WHERE 
		p.Name = 'Greg Barrett' AND r.Name = 'Project Lead')
BEGIN
	INSERT INTO 
		dbo.PersonRole (PersonId, RoleId)
	VALUES
		(
			(SELECT TOP 1 PersonId FROM dbo.Person p WHERE p.Name = 'Greg Barrett'),
			(SELECT TOP 1 RoleId FROM dbo.Role r WHERE r.Name = 'Project Lead')
		)
END
GO

IF NOT EXISTS (SELECT * FROM dbo.Person p 
		INNER JOIN dbo.PersonRole pr ON p.PersonId = pr.PersonId
		INNER JOIN dbo.[Role] r on r.RoleId = pr.RoleId
	WHERE 
		p.Name = 'Greg Taylor' AND r.Name = 'Project Lead')
BEGIN
	INSERT INTO 
		dbo.PersonRole (PersonId, RoleId)
	VALUES
		(
			(SELECT TOP 1 PersonId FROM dbo.Person p WHERE p.Name = 'Greg Taylor'),
			(SELECT TOP 1 RoleId FROM dbo.Role r WHERE r.Name = 'Project Lead')
		)
END
GO

IF NOT EXISTS (SELECT * FROM dbo.Person p 
		INNER JOIN dbo.PersonRole pr ON p.PersonId = pr.PersonId
		INNER JOIN dbo.[Role] r on r.RoleId = pr.RoleId
	WHERE 
		p.Name = 'Lena Schofield' AND r.Name = 'Project Lead')
BEGIN
	INSERT INTO 
		dbo.PersonRole (PersonId, RoleId)
	VALUES
		(
			(SELECT TOP 1 PersonId FROM dbo.Person p WHERE p.Name = 'Lena Schofield'),
			(SELECT TOP 1 RoleId FROM dbo.Role r WHERE r.Name = 'Project Lead')
		)
END
GO
