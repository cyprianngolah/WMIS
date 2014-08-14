CREATE TABLE [dbo].[References]
(
	[ReferenceId]                     INT              NOT NULL IDENTITY,
	[Code]                            NVARCHAR (50)    NOT NULL,
    [Author]                          NVARCHAR (255)   NULL,
    [Year]                            INT              NULL,
    [Title]                           NVARCHAR (255)   NULL,
    [EditionPublicationOrganization]  NVARCHAR (255)   NULL,
    [VolumePage]                      NVARCHAR (255)   NULL,
    [Publisher]                       NVARCHAR (255)   NULL,
    [City]                            NVARCHAR (255)   NULL,
    [Location]                        NVARCHAR (255)   NULL,
    CONSTRAINT [PK_References] PRIMARY KEY CLUSTERED ([ReferenceId]),	
    CONSTRAINT [UK_References_Code] UNIQUE ([Code])
)
