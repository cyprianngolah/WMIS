﻿CREATE TABLE [dbo].[HelpLink]
(
	[HelpLinkId] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(100) NOT NULL, 
    [TargetUrl] NVARCHAR(400) NOT NULL, 
    [Ordinal] INT NULL DEFAULT 1
)
