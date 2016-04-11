﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private MongoRepository repo = new MongoRepository("services");

        // GET: api/values
        [HttpGet]
        
        public List<string> Get()
        {
            // return new string[] { "value1", "value2" };

            var coll = repo.GetAllCollectionName();

            return coll;
        }



        [HttpGet(("all"))]
        [Route("all")]
        public ServiceList GetAll()
        {
            var collections = repo.GetAllCollectionName();
            var serviceList = new ServiceList();
            serviceList.ServiceName = new string[collections.Count];

            foreach (var collName in collections)
            {
                var temp = collName.Split('.');
                serviceList.ServiceName[int.Parse(temp[0]) - 1] = temp[1];
                var service = repo.GetDocumentList<Models.Services>(collName);
                serviceList.ServiceDetails.Add(service);

            }
           

            return serviceList;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}