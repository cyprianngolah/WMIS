CREATE TABLE [dbo].[CollarMalfunctions]
(
	[CollarMalfunctionId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_CollarMalfunctions] PRIMARY KEY ([CollarMalfunctionId]),
	CONSTRAINT [UK_CollarMalfunctions_Name] UNIQUE ([Name]),
)
