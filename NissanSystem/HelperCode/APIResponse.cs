using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NissanSystem.HelperCode
{
    public class APIResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public object ResponseData { get; set; }

        public APIResponse(bool status, string message, object data)
        {
            IsSuccess = status;
            Message = message;
            ResponseData = data;
        }

        public APIResponse(bool status, string message)
        {
            IsSuccess = status;
            Message = message;
        }
    }
}

