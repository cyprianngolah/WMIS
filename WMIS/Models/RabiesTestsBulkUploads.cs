using System;
using System.Collections.Generic;
namespace Wmis.Models
{
    using System;
    using Wmis.Models.Base;

    public class RabiesTestsBulkUploads : KeyedModel
    {
        public string UploadType { get; set; }

        public string FilePath { get; set; }

        public string OriginalFileName { get; set; }

        public string FileName { get; set; }

        public bool IsSuccessful { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}