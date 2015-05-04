CREATE PROCEDURE [dbo].[HelpLink_Delete]
    @p_helpLinkId INT
AS

	DELETE 
		dbo.HelpLink
	WHERE
	 @p_helpLinkId = HelpLinkId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HelpLink_Delete] TO [WMISUser]
GO