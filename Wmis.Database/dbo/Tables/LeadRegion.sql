CREATE TABLE [dbo].[LeadRegion]
(
	[LeadRegionId] INT NOT NULL IDENTITY , 
    [Name] NVARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_LeadRegion] PRIMARY KEY ([LeadRegionId])
)
