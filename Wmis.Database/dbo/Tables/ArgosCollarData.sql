CREATE TABLE [dbo].[ArgosCollarData]
(
	[ArgosCollarDataId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [CollaredAnimalId] INT NOT NULL, 
    [Date] DATETIME NOT NULL, 
    [ValueType] NVARCHAR(50) NOT NULL, 
    [Value] NVARCHAR(250) NOT NULL, 
    CONSTRAINT [FK_ArgosCollarData_Collars] FOREIGN KEY ([CollaredAnimalId]) REFERENCES dbo.[CollaredAnimals] (CollaredAnimalId)
)
