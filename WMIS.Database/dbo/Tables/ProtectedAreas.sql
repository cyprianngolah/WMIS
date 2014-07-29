CREATE TABLE [dbo].[ProtectedAreas]
(
	[ProtectedAreaId] INT             NOT NULL IDENTITY,
	[Name]            NVARCHAR (50)   NOT NULL,
	CONSTRAINT [PK_ProtectedAreas] PRIMARY KEY CLUSTERED ([ProtectedAreaId]),
	CONSTRAINT [UK_ProtectedAreas_Name] UNIQUE ([Name]),
)