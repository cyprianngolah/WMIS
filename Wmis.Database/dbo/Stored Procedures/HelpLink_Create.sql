CREATE PROCEDURE [dbo].[HelpLink_Create]
    @p_name NVARCHAR(100), 
    @p_targetUrl NVARCHAR(400), 
    @p_ordinal INT = 1
AS

	INSERT INTO dbo.HelpLink(Name, TargetUrl, Ordinal)
	VALUES (@p_name, @p_targetUrl, @p_ordinal)	

	SELECT SCOPE_IDENTITY()

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HelpLink_Create] TO [WMISUser]
GO