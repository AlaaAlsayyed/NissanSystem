using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NissanSystem.HelperCode;
using NissanSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace NissanSystem.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(UserLoginModel userModel, string returnUrl = null)
        {
            string errorMsg;
            string userName = userModel.UserName;

            try
            {

                if (FormIsValid(ref userName, userModel.Password, out errorMsg))
                {
                    UserLoginModel user = ValidateUserCredentials(userName, userModel.Password);
                    if (user != null)
                    {
                        var identity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);
                        identity.AddClaim(new Claim(ClaimTypes.Name, user.Serialize()));

                        await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties { IsPersistent = userModel.RememberMe });
                        return RedirectToLocal(returnUrl);
                    }
                    else
                    {
                        ViewData["ModelState"] = $"Wrong Username or Password.";
                        return View();
                    }
                }
                else
                {
                    ViewData["ModelState"] = errorMsg;
                    return View();
                }
            }
            catch (Exception ex)
            {
                ViewData["ModelState"] = ex.Message;
                return View();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);
            else
                return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        private bool FormIsValid(ref string username, string password, out string errorMsg)
        {
            errorMsg = "";
            StringBuilder sbError = new StringBuilder();
            if (string.IsNullOrWhiteSpace(username))
                sbError.AppendLine("Username is required");

            if (string.IsNullOrWhiteSpace(password))
                sbError.AppendLine("Password is required");
            if (sbError.Length > 0)
            {
                errorMsg = sbError.Replace("\n", "<br/>").ToString();
                return false;
            }
            return true;
        }// end FormIsValid

        private UserLoginModel ValidateUserCredentials(string username, string password)
        {
            UserLoginModel user;

            user = DBHelper.getUser(username, password);

            return user;
        }
    }
}