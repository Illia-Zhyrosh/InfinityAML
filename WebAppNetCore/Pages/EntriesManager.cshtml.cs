using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Cryptography.X509Certificates;
using System.Xml;
using MongoDB.Driver;
using WebAppNetCore.wwwroot.Models.DataModel;
using System.Text;
using System.Xml.Linq;
using MongoDB.Bson;

namespace WebAppNetCore.Pages
{
    public class PrivacyModel : PageModel
    {
        private readonly ILogger<PrivacyModel> _logger;

        public PrivacyModel(ILogger<PrivacyModel> logger)
        {
            _logger = logger;
        }
        
        public void OnGet()
        {
            
        }
        public RedirectToActionResult OnPostDoWork()
        {
            var inpString = HttpContext.Request.Form["userInput"];
            var inpData = HttpContext.Request.Form["userData"];
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.Development.json");

            IConfiguration configuration = builder.Build();
            var constring = configuration["MyDatabaseSettings:ConnectionString"];
            var client = new MongoClient(constring);
            var database = client.GetDatabase("AMLDatabase");
            var data = new DataModel();
            IMongoCollection<DataModel> collection;
            if(database.GetCollection<DataModel>(inpString).CountDocuments(_ => true) > 0)
            {
                collection = database.GetCollection<DataModel>(inpString);
                var filter = Builders<DataModel>.Filter.Eq("Name", "firstString");
                var update = Builders<DataModel>.Update.Set("Data", PrettyXml(inpData));
                collection.UpdateOne(filter,update);
            }
            else
            {
                database.CreateCollectionAsync(inpString);
                collection = database.GetCollection<DataModel>(inpString);
                data.Name = "firstString";
                data.Data = PrettyXml(inpData);
                collection.InsertOneAsync(data);

            }
            System.Diagnostics.Debug.WriteLine(inpString + "\n" + PrettyXml(inpData));
            return RedirectToAction("Index");
            
        }
        static string PrettyXml(string rawStringxml)
        {
            XmlDocument xmlDoc = new XmlDocument();
            StringWriter sw = new StringWriter();
            xmlDoc.LoadXml(rawStringxml);
            xmlDoc.Save(sw);
            String formattedXml = sw.ToString();

            return formattedXml;
        }
    }
}