CREATE TABLE [dbo].[CollarStatuses]
(
	[CollarStatusId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
	[Description] NVARCHAR(MAX) NULL, 
    [Order] INT NULL, 
    CONSTRAINT [PK_CollarStatuses] PRIMARY KEY ([CollarStatusId]),
	CONSTRAINT [UK_CollarStatuses_Name] UNIQUE ([Name])
)
