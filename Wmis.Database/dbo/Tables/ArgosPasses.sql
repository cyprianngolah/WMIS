CREATE TABLE [dbo].[ArgosPasses]
(
	[ArgosPassId]   INT         NOT NULL IDENTITY,
	[CollarId]      INT         NOT NULL,
	[Latitude]      FLOAT       NOT NULL,
	[Longitude]     FLOAT       NOT NULL,
	[LocationDate]  DATETIME    NOT NULL,
	CONSTRAINT [PK_ArgosPasses] PRIMARY KEY CLUSTERED ([ArgosPassId]),
	CONSTRAINT [FK_ArgosPasses_Collars] FOREIGN KEY ([CollarId]) REFERENCES [dbo].[Collars] ([CollarId])
)