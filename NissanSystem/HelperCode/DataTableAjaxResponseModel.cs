using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NissanSystem.HelperCode
{
    public class DataTableAjaxResponseModel
    {
        // properties are not capital due to json mapping
        /// <summary>
        /// Used by DataTables to ensure that the Ajax returns from server-side processing requests are drawn in sequence by DataTables (Ajax requests are asynchronous and thus can return out of sequence).
        /// </summary>
        public int draw { get; set; }
        /// <summary>
        /// Total records, before filtering (i.e. the total number of records in the database)
        /// </summary>
        public long recordsTotal { get; set; }
        /// <summary>
        /// Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this page of data).
        /// </summary>
        public long recordsFiltered { get; set; }
        /// <summary>
        /// The data to be displayed in the table. This is an array of data source objects, one for each row, which will be used by DataTables.
        /// </summary>
        public object data { get; set; }
        /// <summary>
        /// Optional: If an error occurs during the running of the server-side processing script, you can inform the user of this error by passing back the error message to be displayed using this parameter. Do not include if there is no error.
        /// </summary>
        public string error { get; set; }
    }
}
