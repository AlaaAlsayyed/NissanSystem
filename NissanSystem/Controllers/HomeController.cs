using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NissanSystem.HelperCode;
using NissanSystem.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace NissanSystem.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _hostEnvironment;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _hostEnvironment = hostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        //[HttpGet]
        //[ActionName("GetOperators")]
        //public IQueryable GetOperators()
        //{

        //    return (from o in db.Tbloperators
        //            orderby o.TDesc
        //            select new { o.Id, o.TDesc });
        //}
        [HttpPost]
        [ActionName("AddCar")]
        public APIResponse AddCar([FromBody] CarInfo carInfo)
        {
            int affectedRecords = 0;
            try
            {
                using (var db = new NissanSystemDBContext())
                {
                    carInfo.IsVisible = 1;
                    db.CarInfos.Add(carInfo);
                    affectedRecords = db.SaveChanges();
                    return new APIResponse(true, "success", affectedRecords);
                }
            }// end try
            catch (Exception ex)
            {
                return new APIResponse(false, ex.Message, affectedRecords);
            }// end catch
        }

        public async Task<string> AddPhoto(IFormFile postedFile)
        {
            string result = null;

            if (postedFile != null)
            {
                string orgFileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition).FileName.Trim('"');
                string fileExtention = Path.GetExtension(orgFileName).ToLower();
                var fileUniqueName = Guid.NewGuid().ToString() + fileExtention;
                string[] ImageFormats = { ".png", ".jpg", ".jpeg", ".gif" };

                if (ImageFormats.Any(k => k == fileExtention))
                {
                    string fullPath = $"{_hostEnvironment.WebRootPath}\\Uploaded_Photos\\{fileUniqueName}";
                    // Create the directory.
                    Directory.CreateDirectory(Directory.GetParent(fullPath).FullName);

                    // Save the file to the server.
                    await using FileStream output = System.IO.File.Create(fullPath);
                    await postedFile.CopyToAsync(output);
                    result = fileUniqueName;
                }
                else
                {
                    result = "error: the file not uploaded, please insert only image";
                }
            }
            else
            {
                result = "error: please insert image";
            }

            return result;
        }

        [HttpPatch]
        [ActionName("PatchCars")]
        public APIResponse PatchCars([FromBody] DataTableEditorAjaxPutModel dataTableEditorAjaxPutModel)
        {
            List<FieldError> lstFieldErrors = new List<FieldError>();

            try
            {
                using (var db = new NissanSystemDBContext())
                {
                    if (dataTableEditorAjaxPutModel == null)
                        return new APIResponse(false, "dataTableEditorAjaxPutModel is null");

                    if (string.IsNullOrWhiteSpace(dataTableEditorAjaxPutModel.action))
                        return new APIResponse(false, "action is null");

                    if (dataTableEditorAjaxPutModel.data == null)
                        return new APIResponse(false, "data is null");

                    var IDs = dataTableEditorAjaxPutModel.data.Keys;
                    foreach (var obj in dataTableEditorAjaxPutModel.data)
                    {
                        var carInfo = db.CarInfos.Find(Convert.ToInt32(obj.Key));
                        if (carInfo == null)
                            return new APIResponse(false, $"data was modified. (Id = {obj.Key})");

                        if (dataTableEditorAjaxPutModel.action == "edit")
                        {
                            if (obj.Value.ContainsKey("CarType"))
                            {
                                if (string.IsNullOrWhiteSpace(obj.Value["CarType"]))
                                    lstFieldErrors.Add(new FieldError() { name = "CarType", status = "The car type cannot be empty" });
                                else
                                    carInfo.CarType = obj.Value["CarType"];
                            }
                            if (obj.Value.ContainsKey("ProductionYear"))
                            {
                                carInfo.ProductionYear = obj.Value["ProductionYear"];
                            }
                            if (obj.Value.ContainsKey("CarNumber"))
                            {
                                if (string.IsNullOrWhiteSpace(obj.Value["CarNumber"]))
                                    lstFieldErrors.Add(new FieldError() { name = "CarNumber", status = "The car number cannot be empty" });
                                else
                                    carInfo.CarNumber = obj.Value["CarNumber"];
                            }
                            if (obj.Value.ContainsKey("ValidLicense"))
                            {
                                carInfo.ValidLicense = obj.Value["ValidLicense"];
                            }
                            if (obj.Value.ContainsKey("ValidInsurance"))
                            {
                                carInfo.ValidInsurance = obj.Value["ValidInsurance"];
                            }
                            if (obj.Value.ContainsKey("CarLocation"))
                            {
                                carInfo.CarLocation = obj.Value["CarLocation"];
                            }
                            if (obj.Value.ContainsKey("CarCounter"))
                            {
                                carInfo.CarCounter = obj.Value["CarCounter"];
                            }
                            if (obj.Value.ContainsKey("CarNotes"))
                            {
                                carInfo.CarNotes = obj.Value["CarNotes"];
                            }
                            if (obj.Value.ContainsKey("GeneralNotes"))
                            {
                                carInfo.GeneralNotes = obj.Value["GeneralNotes"];
                            }
                            if (obj.Value.ContainsKey("Agency"))
                            {
                                carInfo.Agency = obj.Value["Agency"];
                            }
                            //if (obj.Value.ContainsKey("OpenedForAllUsers"))
                            //    siGroup.OpenedForAllUsers = obj.Value["OpenedForAllUsers"].Equals("1") || obj.Value["OpenedForAllUsers"].Equals("true", StringComparison.CurrentCultureIgnoreCase);

                            //if (obj.Value.ContainsKey("GroupOwnerIDs"))
                            //{
                            //    if (string.IsNullOrWhiteSpace(obj.Value["GroupOwnerIDs"]))
                            //        siGroup.GroupOwnerId = "";
                            //    else
                            //        siGroup.GroupOwnerId = $"[{obj.Value["GroupOwnerIDs"]}]";
                            //}
                        }
                        else if (dataTableEditorAjaxPutModel.action == "remove")
                        {
                            carInfo.IsVisible = 0;
                        }
                    }// end foreach

                    // check for errors
                    if (lstFieldErrors.Count > 0)
                        return new APIResponse(false, "Validation error(s)", new { fieldErrors = lstFieldErrors, data = new string[] { } });

                    int affectedRecords = db.SaveChanges();

                    return new APIResponse(true, $"affectedRecords = {affectedRecords}", dataTableEditorAjaxPutModel);
                }
            }// end try
            catch (Exception ex)
            {
                return new APIResponse(false, ex.Message, dataTableEditorAjaxPutModel);
            }// end catch
        }// end Patchsi_groups

        [ActionName("GetCars")]
        public string GetCars()
        {
            try
            {
                using (var db = new NissanSystemDBContext())
                {
                    var cars = JsonConvert.SerializeObject(db.CarInfos.Where(k => k.IsVisible == 1).ToList());
                    return cars;
                }
            }// end try
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject("");
            }// end catch
        }

    }
}
