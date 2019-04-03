using System;
using CsvHelper;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace Wmis.Dto.WMISTools
{
    public class ToolsFileReader
    {
        public ToolsFileReader()
        {

        }
        
        public IEnumerable<ToolsCollarData> GetRetrievedCollarDataRows(ToolsTelonicsOutputFile parsedFile)
        {
           
            var dataRows = new List<ToolsCollarData>();

            foreach (var row in parsedFile.Rows.Where(r => string.IsNullOrEmpty(r.Error)
                                            && r.Timestamp.HasValue
                                            && r.Timestamp <= DateTime.Now
                                            && r.Timestamp > DateTime.MinValue
                                            && r.GpsLatitude.HasValue
                                            && r.GpsLongitude.HasValue
                                            && !r.PredeploymentData.Contains("Yes")))
            {

                if (row.GpsFixAttempt.Contains("Succeeded"))
                {
                    var data = new ToolsCollarData
                    {
                        CTN = parsedFile.CTN,
                        Timestamp = row.Timestamp,
                        GpsLatitude = row.GpsLatitude,
                        GpsLongitude = row.GpsLongitude,
                        GpsFixAttempt = row.GpsFixAttempt,
                        PredeploymentData = row.PredeploymentData,
                        Mortality = row.Mortality,
                        LocationClass = "G"
                    };

                    dataRows.Add(data);
                }

            }

            return dataRows;
        }

        public ToolsTelonicsOutputFile ParseFile(FileInfo file)
        {
            ToolsTelonicsOutputFile outFile = new ToolsTelonicsOutputFile();
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
                            case "data source":
                                outFile.DataSource = value;
                                break;
                            case "ctn":
                                outFile.CTN = value;
                                break;
                            case "acquisition time":
                                foundHeader = true;
                                headers = row.Select(t => t.ToLower().Trim()).ToList();
                                break;
                            case "headers row":
                                outFile.HeadersRow = Int32.Parse(value);
                                break;
                            default:
                                break;
                        }
                    }

                    while (csv.Read())
                    {
                        ToolsTelonicsOutputFileRow detail = null;
                        /*
                        if (_collarType == "Telonics Argos or Iridium")
                        {
                            detail = ReadArgosAndIridiumFileRow(csv, headers);
                        }
                        else if (_collarType == "Lotek Iridium")
                        {
                            detail = ReadArgosAndIridiumFileRow(csv, headers);
                        }*/
                        detail = ReadArgosAndIridiumFileRow(csv, headers);

                        ReadArgosAndIridiumFileRow(csv, headers);
                        if (detail != null && !outFile.Rows.Contains(detail) && string.IsNullOrEmpty(detail.Error))
                            outFile.Rows.Add(detail);
                    }
                }

            }

            return outFile;

        }


        private static IridiumAndArgosOutputFileRow ReadArgosAndIridiumFileRow(CsvReader csv, List<string> headers)
        {
            var detail = new IridiumAndArgosOutputFileRow();

            if (headers.Contains("acquisition time"))
                detail.Timestamp = csv.GetField<DateTime>(headers.IndexOf("acquisition time"));

            if (headers.Contains("gps latitude"))
                detail.GpsLatitude = csv.GetField<double?>(headers.IndexOf("gps latitude"));

            if (headers.Contains("gps longitude"))
                detail.GpsLongitude = csv.GetField<double?>(headers.IndexOf("gps longitude"));

            if (headers.Contains("temperature"))
                detail.Temperature = csv.GetField<double?>(headers.IndexOf("temperature"));

            if (headers.Contains("gps fix attempt"))
                detail.GpsFixAttempt = csv.GetField<string>(headers.IndexOf("gps fix attempt"));
            if (headers.Contains("mortality"))
                detail.Mortality = csv.GetField<string>(headers.IndexOf("mortality"));

            if (headers.Contains("error"))
                detail.Error = csv.GetField<string>(headers.IndexOf("error"));

            if (headers.Contains("predeployment data"))
                detail.PredeploymentData = csv.GetField<string>(headers.IndexOf("predeployment data"));

            return detail;
        }




    }



}