CREATE TABLE [dbo].[PersonRole]
(
	[PersonRoleId] INT NOT NULL IDENTITY , 
    [PersonId] INT NOT NULL, 
    [RoleId] INT NOT NULL, 
    CONSTRAINT [PK_PersonRole] PRIMARY KEY ([PersonRoleId]), 
    CONSTRAINT [AK_PersonRole_Column] UNIQUE ([PersonId], [RoleId]), 
    CONSTRAINT [FK_PersonRole_Role] FOREIGN KEY (RoleId) REFERENCES dbo.[Role] ([RoleId]), 
    CONSTRAINT [FK_PersonRole_Person] FOREIGN KEY ([PersonId]) REFERENCES dbo.[Person]([PersonId]) 
)
