/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

:r .\dbo\Fill\LeadRegion.sql
:r .\dbo\Fill\ProjectStatus.sql
:r .\dbo\Fill\Person.sql
:r .\dbo\Fill\Role.sql
:r .\dbo\Fill\PersonRole.sql
:r .\dbo\Fill\SpeciesSynonymTypes.sql
:r .\dbo\Fill\SurveyType.sql
:r .\dbo\Fill\SurveyTemplate.sql
:r .\dbo\Fill\SurveyTemplateColumns.sql
:r .\dbo\Fill\ObservationUploadStatuses.sql
:r .\dbo\Fill\SurveyTemplateColumnTypes.sql