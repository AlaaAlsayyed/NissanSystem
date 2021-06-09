using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace NissanSystem.HelperCode
{
    public static class XmlExtension
    {
        public static string Serialize<T>(this T value)
        {
            if (value == null)
                return string.Empty;

            var xmlSerializer = new XmlSerializer(typeof(T));

            using (var stringWriter = new StringWriter())
            {
                using (var xmlWriter = XmlWriter.Create(stringWriter, new XmlWriterSettings { Indent = false }))
                {
                    xmlSerializer.Serialize(xmlWriter, value);
                    return stringWriter.ToString();
                }
            }
        }// end function Serialize

        public static T Deserialize<T>(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return default(T);

            var xmlSerializer = new XmlSerializer(typeof(T));
            using (var stringReader = new StringReader(value))
            {
                using (var xmlReader = XmlReader.Create(stringReader, new XmlReaderSettings()))
                {
                    T t = (T)xmlSerializer.Deserialize(xmlReader);
                    return t;
                }
            }
        }// end function Deserialize
    }
}
