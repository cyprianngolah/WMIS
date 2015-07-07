using CsvHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Wmis.Argos.Entities;

namespace Wmis.Argos
{
    public class ArgosFileReader
    {
        private DirectoryInfo _directory;

        public ArgosFileReader(string folderPath)
        {
            _directory = new DirectoryInfo(folderPath);

            ValidatePath();
        }

        private bool ValidatePath()
        {
            if (!_directory.Exists)
                throw new Exception("The directory '" + _directory.FullName + "' doesn't exist");

            try
            {
                var file = _directory.GetFiles().FirstOrDefault();

                if (file != null)
                {
                    using (var fs = file.OpenRead())
                    {
                        fs.ReadByte();
                    }
                }

                return true;
            }
            catch (Exception)
            {
                throw new Exception("Unable to read files from the directory.");
            }
        }

        public IEnumerable<ArgosOutputFile> ReadFiles()
        {
            var files = new List<ArgosOutputFile>();

            var csvFiles = _directory.GetFiles(".csv");

            foreach (var csv in csvFiles)
            {
                var outFile = ParseFile(csv);

                files.Add(outFile);
            }

            return files;
        }

        private ArgosOutputFile ParseFile(FileInfo file)
        {
            ArgosOutputFile outFile = new ArgosOutputFile();

            using (var fs = file.OpenRead())
            {
                using (var csv = new CsvReader(new StreamReader(fs)))
                {
                    var foundHeader = false;
                    var headers = new List<string>();

                    while (!foundHeader && csv.Read())
                    {
                        var row = csv.CurrentRecord;

                        if (row.Length < 2)
                            continue;

                        var title = csv.GetField<string>(0) ?? "";
                        var value = csv.GetField<string>(1) ?? "";

                        title = title.ToLower().Trim();

                        switch (title)
                        {
                            case "ctn":
                                outFile.CTN = value;
                                break;
                            case "acquisition time":
                                foundHeader = true;
                                headers = row.Select(t => t.ToLower().Trim()).ToList();
                                break;
                            default:
                                break;
                        }
                    }

                    while (csv.Read())
                    {
                        var detail = new ArgosOutputFileRow();

                        if (headers.Contains("acquisition time"))
                            detail.Timestamp = csv.GetField<DateTime>(headers.IndexOf("acquisition time"));

                        if (headers.Contains("argos location class"))
                            detail.LocationClass = csv.GetField<string>(headers.IndexOf("argos location class"));

                        if (headers.Contains("argos latitude"))
                            detail.ArgosLatitude = csv.GetField<double?>(headers.IndexOf("argos latitude"));
                        
                        if (headers.Contains("argos longitude"))
                            detail.ArgosLongitude = csv.GetField<double?>(headers.IndexOf("argos longitude"));
                        
                        if (headers.Contains("argos altitude"))
                            detail.ArgosAltitude = csv.GetField<double?>(headers.IndexOf("argos altitude"));

                        if (headers.Contains("gps fix attempt"))
                            detail.GpsFixAttempt = csv.GetField<string>(headers.IndexOf("gps fix attempt"));
                                                
                        if (headers.Contains("gps latitude"))
                            detail.GpsLatitude = csv.GetField<double?>(headers.IndexOf("gps latitude"));
                                                
                        if (headers.Contains("gps longitude"))
                            detail.GpsLongitude = csv.GetField<double?>(headers.IndexOf("gps longitude"));
                                                
                        if (headers.Contains("temperature"))
                            detail.Temperature = csv.GetField<double?>(headers.IndexOf("temperature"));
                        
                        if (headers.Contains("low voltage"))
                            detail.LowVoltage = csv.GetField<string>(headers.IndexOf("low voltage"));

                        if (headers.Contains("mortality"))
                            detail.Mortality = csv.GetField<string>(headers.IndexOf("mortality"));
                        
                        if (headers.Contains("error"))
                            detail.Mortality = csv.GetField<string>(headers.IndexOf("error"));
                                                
                        if (!outFile.Rows.Contains(detail))
                            outFile.Rows.Add(detail);
                    }
                }
            }

            return outFile;
        }
    }
}
