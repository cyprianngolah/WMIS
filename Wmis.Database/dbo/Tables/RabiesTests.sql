CREATE TABLE [dbo].[RabiesTests](
	[TestId] [int] IDENTITY(1,1) NOT NULL,
	[DateTested] [datetime] NULL,
	[DataStatus] [nvarchar](30) NULL,
	[Year] [nvarchar](20) NULL,
	[SubmittingAgency] [nvarchar](50) NULL,
	[LaboratoryIDNo] [nvarchar](30) NULL,
	[TestResult] [nvarchar](20) NULL,
	[Community] [nvarchar](30) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[RegionId] [int] NULL,
	[GeographicRegion] [nvarchar](50) NULL,
	[Species] [nvarchar](30) NULL,
	[AnimalContact] [nvarchar](10) NULL,
	[HumanContact] [nvarchar](10) NULL,
	[Comments] [nvarchar](max) NULL,
	[LastUpdated] [datetime] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]