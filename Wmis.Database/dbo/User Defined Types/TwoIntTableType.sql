CREATE TYPE [dbo].[TwoIntTableType] AS TABLE 
( 
	n INT,
	p INT
)
GO


GRANT EXECUTE ON TYPE::[dbo].[TwoIntTableType] TO [WMISUser]
GO