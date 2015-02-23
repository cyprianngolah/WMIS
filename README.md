# WMIS #

#### Development Environment ####

- Visual Studio 2013 (Update 2)
- SQL Server 2012 (optional, but recommended for local development)
  - If you do not have a full version of SQL Server 2012, 'SQL Server 2012 Express With Advanced Services' (ENU\x64\SQLEXPRADV\_x64\_ENU.exe) can be downloaded free of charge [here](http://www.microsoft.com/en-ca/download/details.aspx?id=29062).
- ReSharper 8
- StyleCop (https://stylecop.codeplex.com)
    - It is important that StyleCop be installed **AFTER** ReSharper as the StyleCop installation adds a plugin to ReSharper that provides visual feedback of StyleCop violations.
  
#### Getting Started ####

##### Setup / update a local database #####
  - From within Visual Studio, right click the WMIS.Database project and click 'Publish'.
  - Click 'Edit' to specify a connection string to your local SQL Server 2012 instance.
  - In the 'Connect to database' section, provide a database name such as 'WMIS' and click 'OK'
  - Click 'Publish'

##### Configure IIS #####
  - From within IIS Manager, right click the Sites folder and click 'Add Website'
  - Site name: WMIS
  - Application pool: WMIS
  - Physical path: <path to your source code directory>
  - Binding: http, All unassigned, port 80 
  - Host name: wmis.local
  - (Windows Auth) Add the following Registry Information:
	Navigate To:
		HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\LanmanServer\Parameters
	Add:
		Value name: DisableStrictNameChecking
		Data type: REG_DWORD
		Radix: Decimal
		Value: 1 
  - (Windows Auth) Follow the steps for Method 1 at http://support.microsoft.com/kb/896861 (adding wmis.local as the host)
  - (Windows Auth) In IIS Manager for YEC site, click Authentication and ensure only Windows Authentication is checked
  - (Windows Auth) Ensure the "Users" group has permission the Website folder
  
##### Edit hosts file #####
  - Navigate to the hosts file (C:\Windows\System32\drivers\etc)
  - Open the 'hosts' file and add the following mapping to the bottom of the file: **127.0.0.1 wmis.local**
  

#### WMIS.Database workflow ####

For simple changes it's often easiest to use the Visual Studio IDE to apply changes directly against the database project. For more complex changes, developers may choose to use SQL Server Management Studio (SSMS) and the following workflow:

- Use SSMS to build, test, and modify queries/tables/procedures/views directly against your local database
- Once complete export your change script(s) from SSMS and revert all of your changes made to the local database 
- Add change script(s) to the WMIS database project
- Generate a publish script from the database project (right click the database project -> Publish -> Generate Script)
- Review the generated script to ensure only intended changes are made
- Apply the entire generated script to the database via SSMS or publish directly from Visual Studio (or right click the database project -> Publish -> Publish)
  
#### Coding Standards ####

- C# standards as defined by StyleCop/ReSharper
- JavaScript standards as defined by JSLint
	
#### Database Standards ####

- Keywords shall be uppercase: SELECT, WHERE, NOT, INSERT
- Pluralized table names: Animals
- Primary keys will be fully qualified with the singular version of the table name: AnimalId
- Primary keys: PK_Animals
- Foreign keys (underscore separated table names): FK\_Animals\_Species
- Indexes (underscore separated table name and involved columns): IX\_Animals\_NameSpeciesColor / UX\_Animals\_NameSpeciesColor

#### HELP ####

- [Learn how to edit Markdown](https://bitbucket.org/tutorials/markdowndemo)