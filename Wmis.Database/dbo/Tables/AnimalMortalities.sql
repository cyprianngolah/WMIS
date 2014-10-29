CREATE TABLE [dbo].[AnimalMortalities]
(
	[AnimalMortalityId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_AnimalMortalities] PRIMARY KEY CLUSTERED ([AnimalMortalityId]),
	CONSTRAINT [UK_AnimalMortalities_Name] UNIQUE ([Name]),
)
