CREATE TABLE [dbo].[ArgosUsers]
(
	[ArgosUserId]	INT NOT NULL IDENTITY, 
    [Name]			NVARCHAR(50) NOT NULL, 
    [Password]		NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK_ArgosUsers] PRIMARY KEY ([ArgosUserId]),
	CONSTRAINT [UK_ArgosUsers_Name] UNIQUE ([Name])
)
