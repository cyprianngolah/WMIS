CREATE TABLE [dbo].[Person]
(
	[PersonId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    [Email] NVARCHAR(50) NOT NULL, 
    [JobTitle] NVARCHAR(50) NULL, 
    CONSTRAINT [PK_Person] PRIMARY KEY ([PersonId])
)
