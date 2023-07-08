using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Extensions;


namespace WebAppNetCore.wwwroot
{
    [Route("Collection")]
    [ApiController]
    public class Collection
    {
        public string Name { get; set; }
    }

    public class EntryManagerController : ControllerBase
    {
       
            
        [HttpPost]
        
        public string Post(Collection obj)
        {
            
            return obj.Name;
        }
    }
}
