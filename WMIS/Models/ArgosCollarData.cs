using System;
using System.ComponentModel;
using Wmis.Models.Base;

namespace Wmis.Models
{
    public class ArgosCollarData : KeyedModel
    {
        public int CollaredAnimalId { get; set; }

        public DateTime Date { get; set; }

        public ArgosCollarDataValueType ValueType { get; set; }

        public string Value { get; set; }
    }

    public enum ArgosCollarDataValueType
    {
        [Description("Temperature")]
        Temperature,

        [Description("Low Voltage")]
        LowVoltage,

        [Description("Mortality")]
        Mortality
    }
}