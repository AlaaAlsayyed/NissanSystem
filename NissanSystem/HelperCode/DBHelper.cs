using NissanSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NissanSystem.HelperCode
{
    public class DBHelper
    {
        public static UserLoginModel getUser(string userName, string password)
        {
            if (string.IsNullOrWhiteSpace(userName))
            {
                throw new ArgumentNullException("Username is empty");
            }

            UserLoginModel operatorPerson = null;
            try
            {
                using (var dbCtx = new NissanSystemDBContext())
                {
                    operatorPerson = (from u in dbCtx.Users
                                      where u.UserName.Equals(userName) && u.Password.Equals(password)
                                      select new UserLoginModel()
                                      {
                                          UserName = u.UserName,
                                          Password = u.Password
                                      }).FirstOrDefault();

                }// end using dbCtx 
            }// end try
            catch (Exception ex)
            {
            }// end catch
            return operatorPerson;
        }// end getOperatorPerson
    }
}
