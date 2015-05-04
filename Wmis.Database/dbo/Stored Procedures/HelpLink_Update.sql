CREATE PROCEDURE [dbo].[HelpLink_Update]
    @p_helpLinkId INT,
	@p_name NVARCHAR(100), 
    @p_targetUrl NVARCHAR(400),
    @p_ordinal int = 1
AS

	UPDATE 
		dbo.HelpLink 
	SET
		Name = @p_name,
		TargetUrl = @p_targetUrl, 
		Ordinal = @p_ordinal
	WHERE
		@p_helpLinkId = HelpLinkId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HelpLink_Update] TO [WMISUser]
GO