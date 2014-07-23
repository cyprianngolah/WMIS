@echo off

set msbuild=C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe
set msbuildswitches=/ignoreprojectextensions:.vdproj /nologo /clp:ErrorsOnly /fl /flp:Append /property:Configuration=Release /p:VisualStudioVersion=12.0

echo Building Solution and running unit tests (output logged to msbuild.log)
"%msbuild%" DeployDatabase.msbuild %msbuildswitches% /target:GenerateScript;UpdateDatabase

echo Build Complete
pause
@echo on