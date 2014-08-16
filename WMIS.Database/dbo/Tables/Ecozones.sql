CREATE TABLE [dbo].[Ecozones]
(
	[EcozoneId] INT             NOT NULL IDENTITY,
	[Name]      NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_Ecozones] PRIMARY KEY CLUSTERED ([EcozoneId]),
	CONSTRAINT [UK_Ecozone_Name] UNIQUE ([Name]),
)