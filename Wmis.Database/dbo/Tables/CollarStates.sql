CREATE TABLE [dbo].[CollarStates]
(
	[CollarStateId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    [Order] INT NULL, 
    CONSTRAINT [PK_CollarStates] PRIMARY KEY ([CollarStateId]),
	CONSTRAINT [UK_CollarStates_Name] UNIQUE ([Name])
)
