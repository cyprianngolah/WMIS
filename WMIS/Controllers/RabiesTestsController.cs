using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Claims;
using Wmis.Auth;
using Wmis.Dto;
using Wmis.Models;

namespace Wmis.Controllers
{
    public class RabiesTestsController : Controller
    {
        // GET: Index
        public ActionResult Index()
        {
            return View();
        }

   
        public ActionResult New()
        {
            return View();
        }

       
        public ActionResult Edit(int key)
        {
            ViewBag.Key = key;
            return View();
        }

        
        public ActionResult Upload()
        {
            return View();
        }
    }
}