[assembly: System.CLSCompliant(true)]
namespace WMIS.Configuration
{
	using System;
	using System.Collections.Generic;
	using System.Collections.Specialized;
	using System.Configuration;
	using System.IO;
	using System.Linq;
	using System.Runtime.Serialization;
	using System.Web.Hosting;

	public class WebConfiguration
	{
		#region Fields
		// Static Config File Settings Keys
		protected const string EnvironmentMapSettingKey = "HostEnvironmentMap";
		protected const string FallbackEnvironmentSettingKey = "FallbackEnvironment";
		#endregion

		#region Properties
		/// <summary>
		/// All of the AppSettings in the web.config merged with the AppSettings from the environment.*.config for the CurrentEnvironment
		/// </summary>
		public Dictionary<string, string> AppSettings
		{
			get;
			protected set;
		}

		/// <summary>
		/// All of the ConnectionStrings in the web.config merged with the ConnectionStrings from the environment.*.config for the CurrentEnvironment
		/// </summary>
		[IgnoreDataMember]
		public Dictionary<string, string> ConnectionStrings
		{
			get;
			protected set;
		}

		#region Environment Overrides
		/// <summary>
		/// The folder, relative to the executing DLL, in which the environment.*.config files can be found
		/// </summary>
		public string EnvironmentFileFolder 
		{
			get;
			private set;
		}

		/// <summary>
		/// Name of the machine used to compare against the set of Hosts in the HostEnvironmentMap
		/// </summary>
		public string MachineName
		{
			get;
			private set;
		}

		/// <summary>
		/// Name of the Machine in Conjunction with the name of the IIS Website this site is being hosted on
		/// </summary>
		public string SiteName
		{
			get;
			private set;
		}

		/// <summary>
		/// Whether or not a value in the HostEnvironmentMap exists for the current MachineName
		/// </summary>
		public bool IsUsingFallback
		{
			get;
			private set;
		}

		/// <summary>
		/// The Environment used to load the environment.*.config file
		/// </summary>
		public string CurrentEnvironment
		{
			get;
			private set;
		}

		/// <summary>
		/// Path to the environment.*.config file that was loaded for the CurrentEnvironment
		/// </summary>
		public string CurrentEnvironmentConfigFilePath
		{
			get;
			private set;
		}

		/// <summary>
		/// The maps specified in the web.config between Host/Site and Environment
		/// </summary>
		public Dictionary<string, string> HostEnvironmentMap
		{
			get;
			private set;
		}
		#endregion

		#region Properties
		public bool ErrorOnMissingFile
		{
			get;
			private set;
		}
		#endregion

		/// <summary>
		/// Returns the set of ConnectionStrings contained in the config file
		/// </summary>
		[IgnoreDataMember]
		public IEnumerable<KeyValuePair<string, string>> SqlConnectionStrings
		{
			get
			{
				return ConnectionStrings;
			}
		}
		#endregion

		#region Constructors
		public WebConfiguration(string relativeEnvironmentFolder = "\\Environments", bool errorOnMissingFile = true)
		{
			EnvironmentFileFolder = relativeEnvironmentFolder;
			ErrorOnMissingFile = errorOnMissingFile;

			// Get the Machine Name - This is the value that should be used for Windows Services
			MachineName = Environment.MachineName.ToLower();

			// Get MachineName + the Site Name - This is the value that should be used for Web Services/Sites
			var siteName = string.IsNullOrEmpty(HostingEnvironment.SiteName) ? "" : HostingEnvironment.SiteName;
			SiteName = MachineName + "-" + siteName.Replace(" ", "").ToLower();

			// Get the Settings out of the config file
			var environmentSetting = ConfigurationManager.AppSettings[EnvironmentMapSettingKey];
			var fallbackEnvironment = ConfigurationManager.AppSettings[FallbackEnvironmentSettingKey];

			// Parse the HostEnvironmentMap
			HostEnvironmentMap = GetHostEnvironmentMap(environmentSetting);

			// Determine which Environment the current Host should be using (i.e. whether the HostName is 
			// in the maps or whether the fallback environment should be used)
			// Note - for Win Services, the MachineName should be used as the Key, while for Web Services/Sites the HostName should be used as the Key
			if (HostEnvironmentMap.Keys.Any(k => k == SiteName))
			{
				CurrentEnvironment = HostEnvironmentMap[SiteName];
				IsUsingFallback = false;
			}
			else
			{
				// only fallback to default, if this site is running in Development mode
				CurrentEnvironment = fallbackEnvironment;
				IsUsingFallback = true;
			}

			// Get the Settings for the current Environment out of the config file
			RetrieveSettingsFromEnvironmentConfig(CurrentEnvironment);
		}
		#endregion

		#region Private Methods
		protected Dictionary<string, string> MergeAppSettings(NameValueCollection originalSettings, KeyValueConfigurationCollection overrideSettings)
		{
			// Add all the override settings first
			var settings = overrideSettings.AllKeys.ToDictionary(key => key, key => overrideSettings[key].Value);

			// Iterate through the original settings and add any that don't already exist in the settings Dictionary
			foreach (var key in originalSettings.AllKeys.Where(key => !settings.Keys.Any(k => k == key)))
			{
				settings.Add(key, originalSettings[key]);
			}
			return settings;
		}

		protected Dictionary<string, string> MergeConnectionStrings(ConnectionStringSettingsCollection originalConnectionStrings, ConnectionStringSettingsCollection overrideConnectionStrings)
		{
			var connectionStrings = new Dictionary<string, string>();

			// Add all the override connection strings first
			for (var i = 0; i < overrideConnectionStrings.Count; i++)
			{
				var css = overrideConnectionStrings[i];
				var connectionString = css.ConnectionString;
				connectionStrings.Add(css.Name, connectionString);
			}

			// Add the original connection strings if they're not already in the settings
			for (var i = 0; i < originalConnectionStrings.Count; i++)
			{
				var css = overrideConnectionStrings[i];
				if (!connectionStrings.Keys.Any(k => k == css.Name))
				{
					var connectionString = css.ConnectionString;
					connectionStrings.Add(css.Name, connectionString);
				}
			}

			return connectionStrings;
		}

		/// <summary>
		/// Parse the Dictionary of Host/Site => Environment mappings out of a string
		/// </summary>
		/// <param name="settingsToParse"></param>
		/// <returns></returns>
		private Dictionary<string, string> GetHostEnvironmentMap(string settingsToParse)
		{
			// String looks like "host1/environment1; host2/environment2;"
			// Get the pairs of settings by splitting on semi-colon
			var hostEnvironmentPairs = settingsToParse.Split(';');
			var dictionary = new Dictionary<string, string>();

			// Split each pair of settings on slash and add the host & environment key/value to the dictionary
			foreach (var pair in hostEnvironmentPairs)
			{
				var setting = pair.Split('/');
				var host = setting.First().Trim().ToLower();
				var environment = setting.Last().Trim().ToLower();

				if (dictionary.Keys.Any(k => k == host))
				{
					var errorMessage = string.Format("host: {0} is already specified in the {1}", host, EnvironmentMapSettingKey);
					throw new ConfigurationErrorsException(errorMessage);
				}

				dictionary.Add(host, environment);
			}

			return dictionary;
		}

		/// <summary>
		/// Reads the settings out of the environment.*.config file
		/// </summary>
		/// <param name="currentEnvironment"></param>
		private void RetrieveSettingsFromEnvironmentConfig(string currentEnvironment)
		{
			// Get the path to the environment.*.config file
			var configurationFileName = string.Format("environment.{0}.config", currentEnvironment);
			var directory = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().CodeBase);
			directory = directory.Replace(@"file:\", "");
			CurrentEnvironmentConfigFilePath = directory + EnvironmentFileFolder + "\\" + configurationFileName;
			if (!File.Exists(CurrentEnvironmentConfigFilePath))
			{
				if (ErrorOnMissingFile)
				{
					throw new ConfigurationErrorsException("Could not open environment configuration file: " + CurrentEnvironmentConfigFilePath);
				}
				return;
			}

			// Open the config file 
			var fileMap = new ExeConfigurationFileMap
			{
				ExeConfigFilename = CurrentEnvironmentConfigFilePath
			};
			var config = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);

			MergeSettings(config);
		}

		public virtual void MergeSettings(Configuration config)
		{
			// Merge the environment.*.config appSettings and connectionStrings with the web.config settings
			AppSettings = MergeAppSettings(ConfigurationManager.AppSettings, config.AppSettings.Settings);
			ConnectionStrings = MergeConnectionStrings(ConfigurationManager.ConnectionStrings, config.ConnectionStrings.ConnectionStrings);
		}
		#endregion
	}
}