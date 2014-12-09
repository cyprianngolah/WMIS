CREATE TABLE [dbo].[Users]
(
	[UserId]						INT NOT NULL IDENTITY , 
    [Username]						NVARCHAR(50) NOT NULL,
	[FirstName]						NVARCHAR(50) NOT NULL,
	[LastName]						NVARCHAR(50) NOT NULL,
	[AdministratorProjects]			BIT NOT NULL DEFAULT 0,
	[AdministratorBiodiversity]		BIT NOT NULL DEFAULT 0
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId]),
	CONSTRAINT [UK_Users_Username] UNIQUE ([Username])
)