/*
	Initial Seeding, this will probably need to get deleted later
*/

IF NOT EXISTS (SELECT 1 FROM dbo.[LeadRegion] WHERE [Name] = 'Lead Region 1')
BEGIN
	INSERT INTO dbo.[LeadRegion] ([Name])
	VALUES ('Lead Region 1')
END