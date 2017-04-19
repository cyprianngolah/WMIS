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
-- Hangfire SQL 
-- Typically this would just be instantiated on first use, but that user doesn't have access to make changes
-- So we initialize it as part of the Post-Deployment
--:r .\..\packages\HangFire.SqlServer.1.3.4\tools\install.sql

--:r .\dbo\Fill\LeadRegion.sql
--:r .\dbo\Fill\ProjectStatus.sql
--:r .\dbo\Fill\Person.sql
--:r .\dbo\Fill\Role.sql
--:r .\dbo\Fill\PersonRole.sql
--:r .\dbo\Fill\SpeciesSynonymTypes.sql
--:r .\dbo\Fill\SurveyType.sql
--:r .\dbo\Fill\SurveyTemplate.sql
--:r .\dbo\Fill\SurveyTemplateColumns.sql
--:r .\dbo\Fill\ObservationUploadStatuses.sql
--:r .\dbo\Fill\SurveyTemplateColumnTypes.sql


--:r .\dbo\Fill\AgeClasses.sql
--:r .\dbo\Fill\AnimalMortalities.sql
--:r .\dbo\Fill\AnimalSexes.sql
--:r .\dbo\Fill\AnimalStatuses.sql
--:r .\dbo\Fill\ArgosPassStatuses.sql
--:r .\dbo\Fill\ArgosUsers.sql
--:r .\dbo\Fill\BreedingStatuses.sql
--:r .\dbo\Fill\BreedingStatusMethods.sql
--:r .\dbo\Fill\CollarMalfunctions.sql
--:r .\dbo\Fill\CollarRegions.sql
--:r .\dbo\Fill\CollarStates.sql
--:r .\dbo\Fill\CollarStatuses.sql
--:r .\dbo\Fill\CollarTypes.sql
--:r .\dbo\Fill\ConfidenceLevels.sql
--:r .\dbo\Fill\HerdAssociationMethods.sql
--:r .\dbo\Fill\HerdPopulations.sql
--:r .\dbo\Fill\ProjectStatus.sql