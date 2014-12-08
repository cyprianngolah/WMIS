/*
Pre-Deployment Script 
*/

alter table Person add column JobTitle NVARCHAR(50) NULL;
update Person set JobTitle = 'Job Title';
alter table Person alter column JobTitle NVARCHAR(50) NOT NULL;

drop table dbo.CollarHistory;
drop table dbo.Collars;
drop table dbo.ArgosPasses;
