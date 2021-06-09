using System;
using System.Collections.Generic;

#nullable disable

namespace NissanSystem.Models
{
    public partial class CarInfo
    {
        public int Id { get; set; }
        public string CarType { get; set; }
        public string ProductionYear { get; set; }
        public string CarNumber { get; set; }
        public string ValidLicense { get; set; }
        public string ValidInsurance { get; set; }
        public string CarLocation { get; set; }
        public string CarCounter { get; set; }
        public string CarNotes { get; set; }
        public string GeneralNotes { get; set; }
        public string Agency { get; set; }
        public int? IsVisible { get; set; }
        public string Photo1 { get; set; }
        public string Photo2 { get; set; }
        public string Photo3 { get; set; }
        public string Photo4 { get; set; }
    }
}
