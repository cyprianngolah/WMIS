CREATE TABLE [dbo].[ProjectStatus]
(
	[ProjectStatusId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_ProjectStatus] PRIMARY KEY ([ProjectStatusId])
)
