CREATE TABLE [dbo].[AgeClasses]
(
	[AgeClassId]	INT				NOT NULL IDENTITY, 
    [Name]			NVARCHAR(50)	NOT NULL, 
    CONSTRAINT [PK_AgeClasses] PRIMARY KEY CLUSTERED ([AgeClassId]),
	CONSTRAINT [UK_AgeClasses] UNIQUE ([Name]),
)
