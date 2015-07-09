CREATE TYPE [dbo].[ArgosCollarDataTableType] AS TABLE 
(
	[Date]				DATETIME		NOT NULL,
	[ValueType]			NVARCHAR(50)	NOT NULL,
	[Value]				NVARCHAR(250)   NOT NULL
)
GO

GRANT EXECUTE ON TYPE::[dbo].[ArgosCollarDataTableType] TO [WMISUser]
GO