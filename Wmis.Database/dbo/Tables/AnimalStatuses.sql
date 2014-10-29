CREATE TABLE [dbo].[AnimalStatuses]
(
	[AnimalStatusId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_AnimalStatuses] PRIMARY KEY ([AnimalStatusId]),
	CONSTRAINT [UK_AnimalStatuses_Name] UNIQUE ([Name])
)
