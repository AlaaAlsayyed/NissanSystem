using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NissanSystem.HelperCode
{
    [Serializable]
    public class UserLoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }

        public string Serialize()
        {
            return XmlExtension.Serialize(this);
        }
        public static UserLoginModel Deserialize(string value)
        {
            return XmlExtension.Deserialize<UserLoginModel>(value);
        }
    }
}
