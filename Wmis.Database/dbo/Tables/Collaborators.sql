CREATE TABLE [dbo].[Collaborators]
(
	[CollaboratorId]	INT NOT NULL IDENTITY , 
    [Name]				NVARCHAR(50) NOT NULL, 
    [Organization]		NVARCHAR(50) NULL, 
    [Email]				NVARCHAR(50) NULL, 
    [PhoneNumber]		NVARCHAR(50) NULL, 
    CONSTRAINT [PK_Collaborators] PRIMARY KEY ([CollaboratorId])
)
