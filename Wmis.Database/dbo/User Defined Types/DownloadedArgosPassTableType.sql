CREATE TYPE [dbo].[DownloadedArgosPassTableType] AS TABLE(
	[CTN] [nvarchar](50) NULL,
	[Timestamp] [datetime] NULL,
	[GpsLatitude] [float] NULL,
	[GpsLongitude] [float] NULL,
	[GpsFixAttempt] [nvarchar](50) NULL,
	[PredeploymentData] [nvarchar](50) NULL,
	[Mortality] [nvarchar](50) NULL,
	[LocationClass] [nvarchar](50) NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[DownloadedArgosPassTableType] TO [WMISUser]
GO