using Amazon.Runtime.Documents;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Buffers;
using System.Reflection.Metadata;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.Encodings.Web;
using System.Web;
using Microsoft.Extensions.Configuration;
using WebAppNetCore.wwwroot.Models.DataModel;


namespace WebAppNetCore.Pages
{

    public class IndexModel : PageModel
    {
        public string CollectionData { get; set; }

        private readonly ILogger<IndexModel> _logger;


        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }
        public void OnGet()
        {
        }
        public async void OnPostNameChange()
        {
            var inpString = HttpContext.Request.Form["userData"];
            System.Diagnostics.Debug.WriteLine(inpString);
            var data = await DataAsync(inpString);

            CollectionData = data.ToString();
            System.Diagnostics.Debug.WriteLine(data);
        }


        // Requesting data from database and parsing it to invisible <a> tag to use it in js.
        public async Task<string> DataAsync(string collectionName)
        {

            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.Development.json");

            IConfiguration configuration = builder.Build();
            var constring = configuration["MyDatabaseSettings:ConnectionString"];

            string res = "";


            var client = new MongoClient(constring);
            var db = client.GetDatabase("AMLDatabase");
            IMongoCollection<DataModel> collection; 
            try
            {
                collection = db.GetCollection<DataModel>(collectionName);
            }
            catch
            {
                collection = db.GetCollection<DataModel>("XmlStrings");
            }
            

            var results = await collection.FindAsync<DataModel>(_ => true);
            foreach (var result in results.ToList())
            {
                if (result.Data != null)
                {
                    res = result.Data;

                }

            }


            return res;
        }
    }







}


