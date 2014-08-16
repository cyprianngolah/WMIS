# Get Inputs 
param
(
	#[string]$websiteName = "$(Read-Host 'Website Name [e.g MySite]')", 
	[switch]$verbose = $true,
	[switch]$debug = $false
)

function main()
{
	# Install Web Platform Installer
	Write-Host "Checking Web Platform Installer"
	$webPlatformInstalled = InstallWebPlatformInstaller
	
	# Install .NET 3.5, .NET 4.0, .NET 4.5.1, IIS 7 (with Static Compression, Forms Auth, Management Console), MVC 3 & 4, Web Deploy, IIS Url Rewrite Module
	if($webPlatformInstalled -eq $true){
        $products = "NetFramework35,NetFramework4,NetFramework4Update402,NETFramework451,IIS7,FormsAuthentication,IISManagementConsole,IISManagementScriptsAndTools,StaticContent,StaticContentCompression,UrlRewrite2,ASPNET,ASPNET45,MVC3,ManagementService,WDeployNoSMO"
        & "c:\program files\microsoft\web platform installer\webpicmd" /install /Products:$products /log:webpi.log /accepteula /SuppressReboot

		Write-Host "Beginning Product Installs..."
        # Ensure that ASP.NET was properly registered for 4.0 (can sometimes not be if IIS was installed before ASP.NET)
        #& "$env:windir\Microsoft.NET\Framework64\v4.0.30319\SetupCache\Client\setup" /repair /x86 /x64 /ia64 /parameterfolder Client /q /norestart
        & "$env:windir\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe" -i

		# Reset IIS
		Write-Host "Resetting IIS..."
		$Command = "IISRESET"
		Invoke-Expression -Command $Command
		Write-Host "Resetting IIS Complete"
		
		# Configure WebDeplo/Management Service
		Write-Host "Configuring Web Deploy..."
		ConfigureWebDeploy
		Write-Host "Configuring Web Deploy Complete"
	}
	else {
		Write-Error "Could not install Web Platform Installer"
	}
}

##############################################################################################
###################### 			Helper Functions	 					######################
##############################################################################################

function ConfigureWebDeploy(){
	# Stop WMSVC Service
    Stop-Service WMSVC	

	# Enable Remote Connections
    Set-ItemProperty -Path HKLM:\Software\Microsoft\WebManagement\Server -Name EnableRemoteManagement -Value 1
	
	# Allow Windows Credentials or IIS Manager Credentials
    Set-ItemProperty -Path HKLM:\Software\Microsoft\WebManagement\Server -Name RequiresWindowsCredentials -Value 0	
	
    # Start WMSVC Service
    Start-Service WMSVC	
	
	# Give Network Service Modify permissions on the C:\Windows\System32\inetsrv\config folder (so it is able to delete folders like aspnet_client)
	
	
	# Create IIS Manager User
    [System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Web.Management") 
    if([Microsoft.Web.Management.Server.ManagementAuthentication]::GetUser("iismanager_autodeploy") -eq $null){
        [Microsoft.Web.Management.Server.ManagementAuthentication]::CreateUser("iismanager_autodeploy", "4u70d3p!0y")
    }
}

function Test-Key([string]$path, [string]$key) {
    if(!(Test-Path $path)) { return $false }
    if ((Get-ItemProperty $path).$key -eq $null) { return $false }
    return $true
}

function Test-KeyValue ([string]$path, [string]$key, [string]$value) {
   if(! (Test-Key $path $key)) { return $false }
   $valueToCheck = (Get-ItemProperty -Path $path -Name $key).$key
   if ($valueToCheck -eq $value) { return $true }
   return $false
}

# Checks to see if Web Platform Installer 4.6 is already installed and tries to install if it's not. 
# Note - if a Version other than 
function InstallWebPlatformInstaller(){
	if(Test-Key "HKLM:\Software\Microsoft\WebPlatformInstaller\4" "Install") {
		if((Test-KeyValue "HKLM:\Software\Microsoft\WebPlatformInstaller\4" "Version" "7.1.40719.0")) {
			Write-Host "The proper version of the Web Platform Installer is already installed." 
			return $true;
		}
		else {
			Write-Host "The Wrong Version of Web Platform Installer is installed...trying to uninstall." 
			if(! (UninstallWebPlatform)){
				Write-Host "Could not uninstall Web Platform Installer. Please uninstall manually and run this script again." 
				return $false;
			}
		}
	}
	
	try{
		# Download the Web Platform Installer msi
		Write-Host "Downloading Web Platform Installer" 
		$CurrentLocation = (Get-Location).ToString()
		$wc = New-Object System.Net.WebClient
		$msiFile = $CurrentLocation.ToString() + "\WebPlatformInstaller_amd64_en-US.msi" 
		$url = "http://download.microsoft.com/download/7/0/4/704CEB4C-9F42-4962-A2B0-5C84B0682C7A/WebPlatformInstaller_amd64_en-US.msi"
		$wc.DownloadFile($url, $msiFile)
		
		Write-Host "Installing Web Platform Installer" 
		$msiFile = "WebPlatformInstaller_amd64_en-US.msi"
		Start-Process -FilePath "$env:systemroot\system32\msiexec.exe" -ArgumentList "/i `"$msifile`" /qn /passive" -Wait
		# Start-Process -FilePath "$env:systemroot\system32\msiexec.exe" -ArgumentList "/i `"$msifile`"" -Wait
		Write-Host "Done Installing Web Platform Installer" 		
		
		return $true;
	}
	catch {
		Write-Error ("Filed to Download/Install Web Platform Installer " + $_)
		return $false;
	}
}

function UninstallWebPlatform() {
	Uninstall-Software "Microsoft Web Platform Installer"
}

function Uninstall-Software($SoftwareName) {
	$app = Get-WmiObject -Class Win32_Product -Filter "Name LIKE '$SoftwareName%'"
	if($app -eq $null) { 
		Write-Host "Could not locate Microsoft Web Platform Installer"
		return $false 
	}
		
	try {
		Write-Host "Uninstalling Web Platform Installer" 
		$app.Uninstall()
		return $true
	}
	catch {
		return $false
	}
}

function LoadIIS7Module ($ModuleName) {
    $ModuleLoaded = $false
    $LoadAsSnapin = $false
    
	if ((Get-Module -ListAvailable | 
        ForEach-Object {$_.Name}) -contains $ModuleName) {
        Import-Module $ModuleName
        if ((Get-Module | ForEach-Object {$_.Name}) -contains $ModuleName) {
            $ModuleLoaded = $true
        } else {
            $LoadAsSnapin = $true
        }
    }
    elseif ((Get-Module | ForEach-Object {$_.Name}) -contains $ModuleName) {
        $ModuleLoaded = $true
    } else {
        $LoadAsSnapin = $true
    }
	
    if ($LoadAsSnapin) {
        if ((Get-PSSnapin -Registered | 
            ForEach-Object {$_.Name}) -contains $ModuleName) {
            Add-PSSnapin $ModuleName
            if ((Get-PSSnapin | ForEach-Object {$_.Name}) -contains $ModuleName) {
                $ModuleLoaded = $true
            }
        }
        elseif ((Get-PSSnapin | ForEach-Object {$_.Name}) -contains $ModuleName) {
            $ModuleLoaded = $true
        }
        else {
            $ModuleLoaded = $false
        }
    }
    return $ModuleLoaded
}

##############################################################################################
###################### 			Run the Main Script 					######################
##############################################################################################

main