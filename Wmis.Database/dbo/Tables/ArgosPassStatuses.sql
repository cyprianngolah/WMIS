CREATE TABLE [dbo].[ArgosPassStatuses]
(
	[ArgosPassStatusId] INT NOT NULL IDENTITY , 
    [Name]				NVARCHAR(50) NOT NULL, 
	[isRejected]		BIT NOT NULL,
    CONSTRAINT [PK_ArgosPassStatuses] PRIMARY KEY ([ArgosPassStatusId]),
	CONSTRAINT [UK_ArgosPassStatuses_Name] UNIQUE ([Name])
)
