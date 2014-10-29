CREATE TABLE [dbo].[CollarTypes]
(
	[CollarTypeId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_CollarTypes] PRIMARY KEY ([CollarTypeId]),
	CONSTRAINT [UK_CollarTypes_Name] UNIQUE ([Name]),
)
