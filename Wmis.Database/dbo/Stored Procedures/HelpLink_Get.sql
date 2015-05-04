CREATE PROCEDURE [dbo].[HelpLink_Get]
    @p_helpLinkId INT
AS

	SELECT
		h.HelpLinkId as [Key],
		h.Name,
		h.TargetUrl, 
		h.Ordinal
	FROM
		dbo.HelpLink h
	WHERE
	 @p_helpLinkId = h.HelpLinkId

RETURN 0
GO

GRANT EXECUTE ON [dbo].[HelpLink_Get] TO [WMISUser]
GO